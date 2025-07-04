import express, { Request, Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import { connectDB } from './src/database/db_connect';
import { signupUser, loginUser } from './src/api/user';
import { createTransaction, getUserTransactions, updateTransaction, deleteTransaction } from './src/api/transaction';

//Middleware 
import { authenticateToken } from './src/middleware/jwt/authenticateToken';
import { AuthenticatedRequest } from './src/types/express';
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://expencetracker9993.s3-website.ap-south-1.amazonaws.com',
    'http://13.204.100.131:3000', // Local development with backend IP
    'http://localhost:3000' // Local development
  ],
  credentials: false, // No longer need credentials for localStorage approach
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('API SERVER IS READY!');
});


// auth
app.post('/api/auth/signup', async (req: Request, res: Response): Promise<any> => {
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

app.post('/api/auth/login', async (req: Request, res: Response): Promise<any> => {
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

// Logout endpoint
app.post('/api/auth/logout', async (req: Request, res: Response): Promise<any> => {
  try {
    // For localStorage approach, we don't need to clear any server-side cookies
    // The frontend will handle token removal from localStorage
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({
      message: 'Internal server error during logout',
      error: 'SERVER_ERROR'
    });
  }
});

// Transactions
app.post('/api/transaction/create', authenticateToken, async (req: Request, res: Response): Promise<any> => {
  const { type, amount, category, description, date } = req.body;


  try {
    const userId = req.user?.id;
    // Validate input
    if (!userId || !amount || !description || !category || !type || !date) {
      return res.status(400).json({
        message: 'All fields (userId, amount, description, category, type, date) are required',
        error: 'MISSING_FIELDS'
      });
    }

    // Validate amount is a number
    if (isNaN(Number(amount))) {
      return res.status(400).json({
        message: 'Amount must be a valid number',
        error: 'INVALID_AMOUNT'
      });
    }

    // Validate type is either 'income' or 'expense'
    if (!['income', 'expense'].includes(type.toLowerCase())) {
      return res.status(400).json({
        message: 'Type must be either "income" or "expense"',
        error: 'INVALID_TYPE'
      });
    }

    // Validate date format
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({
        message: 'Date must be in a valid format',
        error: 'INVALID_DATE'
      });
    }

    const result = await createTransaction(userId, type, parseFloat(amount), category, description || '', date);

    if (!result.success) {
      return res.status(400).json({
        message: result.message,
        error: result.error || 'TRANSACTION_CREATION_FAILED'
      });
    }

    return res.status(201).json({
      message: result.message,
      success: true
    });
  } catch (error: any) {
    console.error('Error creating transaction:', error);

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        error: error.message || 'VALIDATION_ERROR'
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid data format',
        error: 'INVALID_DATA_FORMAT'
      });
    }

    return res.status(500).json({
      message: "Transaction cannot be created at this time",
      error: 'SERVER_ERROR'
    });
  }
});

// fetch transactions
app.get('/api/transactions', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication failed',
        error: 'USER_NOT_AUTHENTICATED'
      });
    }

    const result = await getUserTransactions(userId);
    if (!result.success) {
      return res.status(400).json({
        message: result.message,
        error: result.error
      });
    }

    return res.status(200).json({
      message: result.message,
      success: true,
      transactions: result.transactions
    });
  } catch (error: any) {
    console.error('Error fetching transactions:', error);

    return res.status(500).json({
      message: "Failed to fetch transactions",
      error: 'SERVER_ERROR'
    });
  }
});

// Update transaction
app.put('/api/transaction/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  const { id } = req.params;
  const { type, amount, category, description, date } = req.body;

  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication failed',
        error: 'USER_NOT_AUTHENTICATED'
      });
    }

    const updateData: any = {};
    if (type !== undefined) updateData.type = type;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = date;
    const result = await updateTransaction(id, userId, updateData);

    if (!result.success) {
      return res.status(400).json({
        message: result.message,
        data: updateData,
        error: result.error
      });
    }

    return res.status(200).json({
      message: result.message,
      success: true,
      transaction: result.transaction
    });
  } catch (error: any) {
    console.error('Error updating transaction:', error);

    return res.status(500).json({
      message: "Failed to update transaction",
      error: 'SERVER_ERROR'
    });
  }
});

// Delete transaction
app.delete('/api/transaction/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication failed',
        error: 'USER_NOT_AUTHENTICATED'
      });
    }

    const result = await deleteTransaction(id, userId);

    if (!result.success) {
      return res.status(400).json({
        message: result.message,
        error: result.error
      });
    }

    return res.status(200).json({
      message: result.message,
      success: true
    });
  } catch (error: any) {
    console.error('Error deleting transaction:', error);

    return res.status(500).json({
      message: "Failed to delete transaction",
      error: 'SERVER_ERROR'
    });
  }
});

// Check authentication status
app.get('/api/auth/check', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
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

const startServer = async () => {
  try {
    // Connect to database
    console.log('Connecting to database...');
    const dbConnected = await connectDB();
    if (!dbConnected) {
      console.error('Failed to connect to database');
      process.exit(1);
    }

    app.set("trust proxy", 1);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();