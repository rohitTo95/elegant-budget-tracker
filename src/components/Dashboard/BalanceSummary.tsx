import { Transaction } from "@/types";

interface BalanceSummaryProps {
  transactions: Transaction[];
}

const BalanceSummary = ({ transactions }: BalanceSummaryProps) => {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-sm font-medium text-muted-foreground">Total Income</h3>
        <p className="text-2xl font-bold text-success">₹{totalIncome.toLocaleString()}</p>
      </div>
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
        <p className="text-2xl font-bold text-error">₹{totalExpenses.toLocaleString()}</p>
      </div>
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-sm font-medium text-muted-foreground">Net Balance</h3>
        <p className={`text-2xl font-bold ${netBalance >= 0 ? "text-success" : "text-error"}`}>
          ₹{netBalance.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default BalanceSummary;