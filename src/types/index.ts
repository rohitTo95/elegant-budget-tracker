export interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface User {
  name: string;
  email: string;
}

export interface UserData {
  user: User;
  transactions: Transaction[];
}