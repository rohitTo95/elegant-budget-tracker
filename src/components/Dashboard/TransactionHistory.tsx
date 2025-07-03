import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Badge 
                    variant={transaction.type === "income" ? "default" : "destructive"}
                    className={transaction.type === "income" ? "bg-success text-success-foreground" : "bg-error text-error-foreground"}
                  >
                    {transaction.type === "income" ? "Income" : "Expense"}
                  </Badge>
                </TableCell>
                <TableCell className={`font-medium ${
                  transaction.type === "income" ? "text-success" : "text-error"
                }`}>
                  ₹{transaction.amount.toLocaleString()}
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                <TableCell>{formatDate(transaction.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionHistory;