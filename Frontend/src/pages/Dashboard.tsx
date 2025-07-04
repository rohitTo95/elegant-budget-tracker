import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BalanceSummary from "@/components/Dashboard/BalanceSummary";
import ExpensePieChart from "@/components/Dashboard/ExpensePieChart";
import TransactionHistory from "@/components/Dashboard/TransactionHistory";
import NewTransactionForm from "@/components/Dashboard/NewTransactionForm";
import { useTransactions } from "@/context/TransactionContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userName, logout } = useAuth();
  const { transactions, loading } = useTransactions();
  const { showSuccess } = useToast();

  const handleLogout = () => {
    logout();
    showSuccess("Logged out successfully", "You have been securely logged out. See you again soon!");
    setTimeout(() => navigate("/login"), 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Expense Tracker</h1>
            <p className="text-muted-foreground">Welcome back, {userName}!</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Balance Summary */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
          <BalanceSummary transactions={transactions} />
        </section>

        {/* Charts and Form Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <ExpensePieChart transactions={transactions} />
          
          {/* New Transaction Form */}
          <NewTransactionForm />
        </div>

        {/* Transaction History */}
        <section>
          <TransactionHistory />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;