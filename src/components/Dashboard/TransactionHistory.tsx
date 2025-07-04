import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types";
import { useTransactions } from "@/context/TransactionContext";
import { useToast } from "@/context/ToastContext";
import { useState } from "react";
import { format } from "date-fns";
import "remixicon/fonts/remixicon.css";

const TransactionHistory = () => {
  const { transactions, loading, error, deleteTransaction: deleteTransactionFn, updateTransaction: updateTransactionFn } = useTransactions();
  const { showSuccess, showError } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Transaction>>({});
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Categories for dropdown
  const incomeCategories = ["Salary", "Freelance", "Investment", "Business", "Other"];
  const expenseCategories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Healthcare", "Other"];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEdit = (transaction: Transaction) => {
    // If already editing this transaction, cancel edit
    if (editingId === transaction._id) {
      setEditingId(null);
      setEditData({});
      return;
    }
    
    // Set this transaction as being edited
    setEditingId(transaction._id);
    setEditData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date
    });
  };

  const handleSave = async (transactionId: string) => {
    try {
      await updateTransactionFn(transactionId, editData);
      setEditingId(null);
      setEditData({});
      showSuccess("Transaction updated successfully", "Your transaction has been updated successfully.");
    } catch (error: any) {
      console.error("Error updating transaction:", error);
      showError("Update Failed", error.message || "Failed to update transaction. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (transaction: Transaction) => {
    if (window.confirm(`Are you sure you want to delete this ${transaction.type} of ₹${transaction.amount}?`)) {
      try {
        await deleteTransactionFn(transaction._id);
        showSuccess("Transaction deleted successfully", "The transaction has been permanently removed from your records.");
      } catch (error: any) {
        console.error("Error deleting transaction:", error);
        showError("Delete Failed", error.message || "Failed to delete transaction. Please try again.");
      }
    }
  };
if (loading) {
    return (
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <div className="flex justify-center py-8">
          <div className="text-muted-foreground">Loading transactions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <div className="flex justify-center py-8">
          <div className="text-destructive">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <div className="flex justify-center py-8">
          <div className="text-muted-foreground">No transactions found. Add your first transaction!</div>
        </div>
      </div>
    );
  }

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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction) => {
              const isEditing = editingId === transaction._id;
              const categories = editData.type === "income" ? incomeCategories : expenseCategories;
              
              return (
                <TableRow 
                  key={transaction._id} 
                  className={isEditing ? "border-2 border-black p-4" : ""}
                >
                  {/* Type Column */}
                  <TableCell className={isEditing ? "p-4" : ""}>
                    {isEditing ? (
                      <Select 
                        value={editData.type} 
                        onValueChange={(value) => setEditData({...editData, type: value as "income" | "expense"})}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge 
                        variant={transaction.type === "income" ? "default" : "destructive"}
                        className={transaction.type === "income" ? "bg-success text-success-foreground" : "bg-error text-error-foreground"}
                      >
                        {transaction.type === "income" ? "Income" : "Expense"}
                      </Badge>
                    )}
                  </TableCell>

                  {/* Amount Column */}
                  <TableCell className={`font-medium ${isEditing ? "p-4" : ""} ${
                    transaction.type === "income" ? "text-success" : "text-error"
                  }`}>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editData.amount || ""}
                        onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value)})}
                        placeholder="Enter amount"
                        className="w-full"
                        min="0"
                        step="0.01"
                      />
                    ) : (
                      `₹${transaction.amount.toLocaleString()}`
                    )}
                  </TableCell>

                  {/* Category Column */}
                  <TableCell className={isEditing ? "p-4" : ""}>
                    {isEditing ? (
                      <Select 
                        value={editData.category} 
                        onValueChange={(value) => setEditData({...editData, category: value})}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      transaction.category
                    )}
                  </TableCell>

                  {/* Description Column */}
                  <TableCell className={`max-w-xs truncate ${isEditing ? "p-4" : ""}`}>
                    {isEditing ? (
                      <Input
                        value={editData.description || ""}
                        onChange={(e) => setEditData({...editData, description: e.target.value})}
                        placeholder="Enter description"
                        className="w-full"
                      />
                    ) : (
                      transaction.description || '-'
                    )}
                  </TableCell>

                  {/* Date Column */}
                  <TableCell className={isEditing ? "p-4" : ""}>
                    {isEditing ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <i className="ri-calendar-line mr-2 h-4 w-4" />
                            {editData.date ? format(new Date(editData.date), "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={editData.date ? new Date(editData.date) : undefined}
                            onSelect={(date) => setEditData({...editData, date: date?.toISOString().split('T')[0] || ""})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      formatDate(transaction.date)
                    )}
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className={`text-right ${isEditing ? "p-4" : ""}`}>
                    <div className="flex justify-end gap-2 flex-wrap">
                      {isEditing ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSave(transaction._id)}
                            className="h-8 px-2 text-green-600 hover:text-green-700"
                          >
                            <i className="ri-check-line text-sm mr-1"></i>
                            <span className="hidden sm:inline">Save</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            className="h-8 px-2 text-gray-600 hover:text-gray-700"
                          >
                            <i className="ri-close-line text-sm mr-1"></i>
                            <span className="hidden sm:inline">Cancel</span>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(transaction)}
                            className="h-8 w-8 p-0"
                          >
                            <i className="ri-edit-line text-sm"></i>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(transaction)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <i className="ri-delete-bin-line text-sm"></i>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionHistory;