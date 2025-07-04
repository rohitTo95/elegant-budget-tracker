import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';

export interface Transaction {
  _id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated) {
        throw new Error('User is not authenticated');
      }

      const response = await axios.get('/api/transactions');

      if (response.data.success) {
        setTransactions(response.data.transactions || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch transactions');
      }
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('User is not authenticated');
      }

      const response = await axios.post('/api/transaction/create', transactionData);

      if (response.data.success) {
        // Refresh transactions to get the latest data
        await fetchTransactions();
      } else {
        throw new Error(response.data.message || 'Failed to add transaction');
      }
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateTransaction = async (id: string, transactionData: Partial<Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('User is not authenticated');
      }

      const response = await axios.put(`/api/transaction/${id}`, transactionData);

      if (response.data.success) {
        // Refresh transactions to get the latest data
        await fetchTransactions();
      } else {
        throw new Error(response.data.message || 'Failed to update transaction');
      }
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('User is not authenticated');
      }

      const response = await axios.delete(`/api/transaction/${id}`);

      if (response.data.success) {
        // Refresh transactions to get the latest data
        await fetchTransactions();
      } else {
        throw new Error(response.data.message || 'Failed to delete transaction');
      }
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  const refreshTransactions = async () => {
    await fetchTransactions();
  };

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        fetchTransactions();
      } else {
        setLoading(false);
        setTransactions([]);
      }
    }
  }, [isAuthenticated, authLoading]);

  const value: TransactionContextType = {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};