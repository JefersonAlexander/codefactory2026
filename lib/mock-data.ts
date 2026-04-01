import { User, Category, Budget, Transaction, MonthlyReport } from './types';

export const mockUser: User = {
  id: '1',
  name: 'María García',
  email: 'maria@ejemplo.com',
  avatar: undefined,
  currency: 'MXN',
  country: 'México',
  financialGoal: 'Ahorrar para vacaciones',
};

export const expenseCategories: Category[] = [
  { id: 'food', name: 'Alimentación', icon: 'utensils', color: '#e67e22', type: 'expense' },
  { id: 'transport', name: 'Transporte', icon: 'car', color: '#3498db', type: 'expense' },
  { id: 'housing', name: 'Vivienda', icon: 'home', color: '#9b59b6', type: 'expense' },
  { id: 'entertainment', name: 'Entretenimiento', icon: 'gamepad', color: '#e74c3c', type: 'expense' },
  { id: 'health', name: 'Salud', icon: 'heart-pulse', color: '#1abc9c', type: 'expense' },
  { id: 'education', name: 'Educación', icon: 'graduation-cap', color: '#f39c12', type: 'expense' },
  { id: 'savings', name: 'Ahorro', icon: 'piggy-bank', color: '#27ae60', type: 'expense' },
  { id: 'other', name: 'Otros', icon: 'ellipsis', color: '#95a5a6', type: 'expense' },
];

export const incomeCategories: Category[] = [
  { id: 'salary', name: 'Salario', icon: 'briefcase', color: '#27ae60', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: 'laptop', color: '#3498db', type: 'income' },
  { id: 'investments', name: 'Inversiones', icon: 'trending-up', color: '#9b59b6', type: 'income' },
  { id: 'bonus', name: 'Bonificaciones', icon: 'gift', color: '#e67e22', type: 'income' },
  { id: 'other-income', name: 'Otros', icon: 'plus-circle', color: '#95a5a6', type: 'income' },
];

export const currentBudget: Budget = {
  id: '1',
  month: 4,
  year: 2026,
  totalBudget: 25000,
  categories: [
    { categoryId: 'food', allocated: 6000, spent: 4250 },
    { categoryId: 'transport', allocated: 3000, spent: 2100 },
    { categoryId: 'housing', allocated: 8000, spent: 8000 },
    { categoryId: 'entertainment', allocated: 2000, spent: 1800 },
    { categoryId: 'health', allocated: 1500, spent: 500 },
    { categoryId: 'education', allocated: 1500, spent: 1200 },
    { categoryId: 'savings', allocated: 2000, spent: 2000 },
    { categoryId: 'other', allocated: 1000, spent: 650 },
  ],
};

export const recentTransactions: Transaction[] = [
  {
    id: '1',
    type: 'expense',
    amount: 450,
    date: '2026-04-01',
    categoryId: 'food',
    description: 'Supermercado semanal',
    paymentMethod: 'debit',
  },
  {
    id: '2',
    type: 'income',
    amount: 15000,
    date: '2026-04-01',
    categoryId: 'salary',
    description: 'Salario quincenal',
  },
  {
    id: '3',
    type: 'expense',
    amount: 200,
    date: '2026-03-30',
    categoryId: 'transport',
    description: 'Gasolina',
    paymentMethod: 'credit',
  },
  {
    id: '4',
    type: 'expense',
    amount: 800,
    date: '2026-03-29',
    categoryId: 'entertainment',
    description: 'Cena en restaurante',
    paymentMethod: 'credit',
  },
  {
    id: '5',
    type: 'expense',
    amount: 8000,
    date: '2026-03-28',
    categoryId: 'housing',
    description: 'Renta mensual',
    paymentMethod: 'transfer',
  },
  {
    id: '6',
    type: 'income',
    amount: 3500,
    date: '2026-03-27',
    categoryId: 'freelance',
    description: 'Proyecto diseño web',
  },
  {
    id: '7',
    type: 'expense',
    amount: 350,
    date: '2026-03-26',
    categoryId: 'food',
    description: 'Comida rápida',
    paymentMethod: 'cash',
  },
  {
    id: '8',
    type: 'expense',
    amount: 1200,
    date: '2026-03-25',
    categoryId: 'education',
    description: 'Curso en línea',
    paymentMethod: 'credit',
  },
  {
    id: '9',
    type: 'expense',
    amount: 500,
    date: '2026-03-24',
    categoryId: 'health',
    description: 'Farmacia',
    paymentMethod: 'debit',
  },
  {
    id: '10',
    type: 'expense',
    amount: 2000,
    date: '2026-03-23',
    categoryId: 'savings',
    description: 'Ahorro mensual',
    paymentMethod: 'transfer',
  },
];

export const monthlyReports: MonthlyReport[] = [
  {
    month: 3,
    year: 2026,
    totalIncome: 28500,
    totalExpenses: 22100,
    balance: 6400,
    categoryBreakdown: [
      { categoryId: 'housing', amount: 8000, percentage: 36.2 },
      { categoryId: 'food', amount: 5500, percentage: 24.9 },
      { categoryId: 'transport', amount: 2800, percentage: 12.7 },
      { categoryId: 'savings', amount: 2000, percentage: 9.0 },
      { categoryId: 'entertainment', amount: 1500, percentage: 6.8 },
      { categoryId: 'education', amount: 1200, percentage: 5.4 },
      { categoryId: 'health', amount: 600, percentage: 2.7 },
      { categoryId: 'other', amount: 500, percentage: 2.3 },
    ],
    status: 'saving',
  },
  {
    month: 2,
    year: 2026,
    totalIncome: 26000,
    totalExpenses: 24500,
    balance: 1500,
    categoryBreakdown: [
      { categoryId: 'housing', amount: 8000, percentage: 32.7 },
      { categoryId: 'food', amount: 6200, percentage: 25.3 },
      { categoryId: 'transport', amount: 3200, percentage: 13.1 },
      { categoryId: 'entertainment', amount: 2500, percentage: 10.2 },
      { categoryId: 'savings', amount: 2000, percentage: 8.2 },
      { categoryId: 'education', amount: 1500, percentage: 6.1 },
      { categoryId: 'health', amount: 800, percentage: 3.3 },
      { categoryId: 'other', amount: 300, percentage: 1.2 },
    ],
    status: 'balanced',
  },
  {
    month: 1,
    year: 2026,
    totalIncome: 25000,
    totalExpenses: 27000,
    balance: -2000,
    categoryBreakdown: [
      { categoryId: 'housing', amount: 8000, percentage: 29.6 },
      { categoryId: 'food', amount: 7000, percentage: 25.9 },
      { categoryId: 'entertainment', amount: 4500, percentage: 16.7 },
      { categoryId: 'transport', amount: 3500, percentage: 13.0 },
      { categoryId: 'savings', amount: 1500, percentage: 5.6 },
      { categoryId: 'health', amount: 1200, percentage: 4.4 },
      { categoryId: 'education', amount: 800, percentage: 3.0 },
      { categoryId: 'other', amount: 500, percentage: 1.9 },
    ],
    status: 'overspending',
  },
];

export const formatCurrency = (amount: number, currency: string = 'MXN'): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getMonthName = (month: number): string => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[month - 1];
};

export const getCategoryById = (id: string): Category | undefined => {
  return [...expenseCategories, ...incomeCategories].find(c => c.id === id);
};
