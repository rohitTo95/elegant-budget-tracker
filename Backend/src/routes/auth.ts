import { Router } from 'express';
import { signupUser, loginUser } from '../api/user';
import jwt from 'jsonwebtoken';
import { authenticateToken, AuthenticatedRequest } from '../middleware/jwt/authenticateToken';

const router = Router();

// User signup
router.post('/signup', async (req, res): Promise<any> => {
  const { name, email, password } = req.body;

  try {
    const result = await signupUser(name, email, password);

    if (!result.success) {
      return res.status(400).json({
        message: result.message,
        error: result.error
      });
    }

    res.status(201).json({
      message: result.message,
      success: true
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    });
  }
});

// User login
router.post('/login', async (req, res): Promise<any> => {
  const { email, password } = req.body;

  try {
    const result = await loginUser(email, password);

    if (!result.success) {
      return res.status(401).json({
        message: result.message,
        error: result.error
      });
    }

    const response = {
      id: result.user?._id,
      name: result.user?.name,
      email: result.user?.email,
      createdAt: result.user?.createdAt,
      updatedAt: result.user?.updatedAt
    };

    const token = jwt.sign(response, process.env.JWT_SECRET || 'secret', {
      expiresIn: '30d'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json({
      message: result.message,
      user: response,
      token
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    });
  }
});

// Check authentication status
router.get('/check', authenticateToken, async (req: AuthenticatedRequest, res): Promise<any> => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
