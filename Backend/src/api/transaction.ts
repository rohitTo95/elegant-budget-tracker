import Transaction, { type Transaction as TransactionType } from '../database/models/transactions';

export interface CreateTransactionResult {
    success: boolean;
    message: string;
    transaction?: TransactionType;
    error?: string;
}

export interface GetTransactionsResult {
    success: boolean;
    message: string;
    transactions?: TransactionType[];
    error?: string;
}

export interface UpdateTransactionResult {
    success: boolean;
    message: string;
    transaction?: TransactionType;
    error?: string;
}

export interface DeleteTransactionResult {
    success: boolean;
    message: string;
    error?: string;
}

export const createTransaction = async (
    userId: string,
    type: 'income' | 'expense',
    amount: number,
    category: string,
    description: string,
    date: string
): Promise<CreateTransactionResult> => {
    try {
        // Validate input
        if (!userId || !type || !amount || !category || !date) {
            return {
                success: false,
                message: 'All fields (type, amount, category, date) are required',
                error: 'MISSING_FIELDS'
            };
        }

        // Validate amount is positive
        if (amount <= 0) {
            return {
                success: false,
                message: 'Amount must be greater than 0',
                error: 'INVALID_AMOUNT'
            };
        }

        // Validate type
        if (!['income', 'expense'].includes(type)) {
            return {
                success: false,
                message: 'Type must be either "income" or "expense"',
                error: 'INVALID_TYPE'
            };
        }

        // Validate date
        const transactionDate = new Date(date);
        if (isNaN(transactionDate.getTime())) {
            return {
                success: false,
                message: 'Invalid date format',
                error: 'INVALID_DATE'
            };
        }

        // Create new transaction
        const newTransaction = new Transaction({
            userId,
            type,
            amount,
            category,
            description: description || '',
            date: transactionDate
        });

        const savedTransaction = await newTransaction.save();

        return {
            success: true,
            message: 'Transaction created successfully',
            transaction: savedTransaction
        };

    } catch (error: any) {
        console.error('Error creating transaction:', error);
        
        // Handle MongoDB validation errors
        if (error.name === 'ValidationError') {
            return {
                success: false,
                message: 'Validation failed',
                error: 'VALIDATION_ERROR'
            };
        }

        // Handle cast errors (invalid ObjectId, etc.)
        if (error.name === 'CastError') {
            return {
                success: false,
                message: 'Invalid data format',
                error: 'INVALID_DATA_FORMAT'
            };
        }

        return {
            success: false,
            message: 'Internal server error occurred',
            error: 'SERVER_ERROR'
        };
    }
};

export const getUserTransactions = async (userId: string): Promise<GetTransactionsResult> => {
    try {
        const transactions = await Transaction.find({ userId })
            .sort({ date: -1 }) // Sort by date, newest first
            .exec();

        return {
            success: true,
            message: 'Transactions fetched successfully',
            transactions
        };

    } catch (error: any) {
        console.error('Error fetching transactions:', error);
        
        return {
            success: false,
            message: 'Failed to fetch transactions',
            error: 'SERVER_ERROR'
        };
    }
};

export const updateTransaction = async (
  transactionId: string,
  userId: string,
  updateData: Partial<{
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
  }>
): Promise<UpdateTransactionResult> => {
  try {
    if (!transactionId || !userId) {
      return {
        success: false,
        message: 'Transaction ID and User ID are required',
        error: 'MISSING_FIELDS'
      };
    }

    // Step 1: Find the existing transaction
    const existingTransaction = await Transaction.findOne({ _id: transactionId, userId });
    if (!existingTransaction) {
      return {
        success: false,
        message: 'Transaction not found or unauthorized',
        error: 'TRANSACTION_NOT_FOUND'
      };
    }

    // Step 2: Check and prepare safeUpdateData
    const safeUpdateData: any = {};
    if (updateData.type && ['income', 'expense'].includes(updateData.type)) {
      safeUpdateData.type = updateData.type;
    }

    if (updateData.amount !== undefined) {
      if (updateData.amount <= 0) {
        return {
          success: false,
          message: 'Amount must be greater than 0',
          error: 'INVALID_AMOUNT'
        };
      }
      safeUpdateData.amount = updateData.amount;
    }

    if (updateData.category) {
      safeUpdateData.category = updateData.category;
    }

    if (updateData.description !== undefined) {
      safeUpdateData.description = updateData.description;
    }

    if (updateData.date) {
      const d = new Date(updateData.date);
      if (isNaN(d.getTime())) {
        return {
          success: false,
          message: 'Invalid date format',
          error: 'INVALID_DATE'
        };
      }
      safeUpdateData.date = d;
    }

    if (Object.keys(safeUpdateData).length === 0) {
      return {
        success: false,
        message: 'No valid fields to update',
        error: 'EMPTY_UPDATE'
      };
    }

    // Step 3: Actually update
    const updated = await Transaction.findOneAndUpdate(
      { _id: transactionId, userId },
      { $set: safeUpdateData },
      { new: true }
    );

    return {
      success: true,
      message: 'Transaction updated successfully',
      transaction: updated!
    };
  } catch (error: any) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return {
        success: false,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR'
      };
    }
    if (error.name === 'CastError') {
      return {
        success: false,
        message: 'Invalid transaction ID format',
        error: 'INVALID_ID_FORMAT'
      };
    }
    return {
      success: false,
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    };
  }
};


export const deleteTransaction = async (
    transactionId: string,
    userId: string
): Promise<DeleteTransactionResult> => {
    try {
        // Validate input
        if (!transactionId || !userId) {
            return {
                success: false,
                message: 'Transaction ID and User ID are required',
                error: 'MISSING_FIELDS'
            };
        }

        // Find and delete the transaction (ensure it belongs to the user)
        const deletedTransaction = await Transaction.findOneAndDelete({ _id: transactionId, userId });

        if (!deletedTransaction) {
            return {
                success: false,
                message: 'Transaction not found or unauthorized',
                error: 'TRANSACTION_NOT_FOUND'
            };
        }

        return {
            success: true,
            message: 'Transaction deleted successfully'
        };

    } catch (error: any) {
        console.error('Error deleting transaction:', error);
        
        // Handle cast errors (invalid ObjectId, etc.)
        if (error.name === 'CastError') {
            return {
                success: false,
                message: 'Invalid transaction ID format',
                error: 'INVALID_ID_FORMAT'
            };
        }

        return {
            success: false,
            message: 'Internal server error occurred',
            error: 'SERVER_ERROR'
        };
    }
};