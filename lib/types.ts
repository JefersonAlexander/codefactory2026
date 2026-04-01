export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currency: string;
  country: string;
  financialGoal?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
}

export interface Budget {
  id: string;
  month: number;
  year: number;
  totalBudget: number;
  categories: CategoryBudget[];
}

export interface CategoryBudget {
  categoryId: string;
  allocated: number;
  spent: number;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  categoryId: string;
  description: string;
  paymentMethod?: string;
}

export interface MonthlyReport {
  month: number;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryBreakdown: {
    categoryId: string;
    amount: number;
    percentage: number;
  }[];
  status: 'saving' | 'balanced' | 'overspending';
}

export type PaymentMethod = 'cash' | 'credit' | 'debit' | 'transfer' | 'other';
