import { useAuth } from '@/context/AuthContext';
import { useTransactions } from '@/context/TransactionContext';

/**
 * Custom hook that provides enhanced logout functionality
 * This clears both authentication and transaction data
 * Returns a logout function that can be called directly
 */
export const useLogout = ():any=> {
  const { logout: authLogout } = useAuth();
  const { clearTransactions } = useTransactions();

  const logout = async () => {
    try {
      // First logout from auth (this calls the backend and clears localStorage)
      await authLogout();
      
      // Clear transaction data from local state
      clearTransactions();
      
      // Clear any other localStorage data
      localStorage.removeItem('sidebar:state');
      
      console.log('Complete logout successful');
    } catch (error) {
      console.error('Error during complete logout:', error);
      
      // Even if auth logout fails, clear local data
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      clearTransactions();
      localStorage.removeItem('sidebar:state');
      
      throw error; // Re-throw so components can handle it
    }
  };

  return logout;
};
