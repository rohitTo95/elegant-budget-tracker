import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BalanceSummary from "@/components/Dashboard/BalanceSummary";
import ExpensePieChart from "@/components/Dashboard/ExpensePieChart";
import TransactionHistory from "@/components/Dashboard/TransactionHistory";
import NewTransactionForm from "@/components/Dashboard/NewTransactionForm";
import userData from "@/data/user.json";
import { UserData, Transaction } from "@/types";

const Dashboard = () => {
  const navigate = useNavigate();
  const data = userData as UserData;
  
  // State to manage transactions dynamically
  const [transactions, setTransactions] = useState<Transaction[]>(data.transactions);
  
  const handleLogout = () => {
    // TODO: Clear auth tokens/session
    console.log("Logging out...");
    navigate("/login");
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const maxId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) : 0;
    const transactionWithId: Transaction = {
      ...newTransaction,
      id: maxId + 1
    };
    setTransactions(prev => [...prev, transactionWithId]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Expense Tracker</h1>
            <p className="text-muted-foreground">Welcome back, {data.user.name}!</p>
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
          <NewTransactionForm onAddTransaction={handleAddTransaction} />
        </div>

        {/* Transaction History */}
        <section>
          <TransactionHistory transactions={transactions} />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;