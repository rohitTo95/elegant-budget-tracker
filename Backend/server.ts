import express, { Request, Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}


const app = express();
const PORT = process.env.PORT || 5000;

import { connectDB } from './src/database/db_connect';
import { signupUser, loginUser } from './src/api/user';
import { createTransaction, getUserTransactions, updateTransaction, deleteTransaction } from './src/api/transaction';

//Middleware 
import { authenticateToken, AuthenticatedRequest } from './src/middleware/jwt/authenticateToken';
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://localhost:3001", 
    "http://localhost:5173",
    process.env.FRONTEND_URL || "https://your-frontend-domain.com"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Elegant Budget Tracker API');
});

// Health check endpoints
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    status: 'healthy'
  });
});

// auth
app.post('/api/user/signup', async (req: Request, res: Response): Promise<any> => {
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

app.post('/api/user/login', async (req: Request, res: Response): Promise<any> => {
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