import { Router } from 'express';
import { createTransaction, getUserTransactions, updateTransaction, deleteTransaction } from '../api/transaction';
import { authenticateToken, AuthenticatedRequest } from '../middleware/jwt/authenticateToken';

const router = Router();

// All transaction routes require authentication
router.use(authenticateToken);

// Create transaction
router.post('/', async (req: AuthenticatedRequest, res): Promise<any> => {
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

// Get all transactions for user
router.get('/', async (req: AuthenticatedRequest, res): Promise<any> => {
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
router.put('/:id', async (req: AuthenticatedRequest, res): Promise<any> => {
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
router.delete('/:id', async (req: AuthenticatedRequest, res): Promise<any> => {
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

export default router;
