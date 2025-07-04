export interface Transaction {
  _id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  name: string;
  email: string;
}

export interface UserData {
  user: User;
  transactions: Transaction[];
}