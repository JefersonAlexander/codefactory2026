"use client";

import { useState } from "react";
import { 
  Plus, 
  TrendingDown, 
  Calendar, 
  DollarSign,
  Search,
  Filter,
  ArrowDownRight,
  CreditCard,
  Banknote,
  Wallet,
  ArrowRightLeft,
  Utensils,
  Car,
  Home,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  PiggyBank,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardHeader } from "@/components/dashboard-header";
import { 
  recentTransactions, 
  expenseCategories, 
  formatCurrency,
  getCategoryById,
  mockUser 
} from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
  'utensils': Utensils,
  'car': Car,
  'home': Home,
  'gamepad': Gamepad2,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'piggy-bank': PiggyBank,
  'ellipsis': MoreHorizontal,
};

const paymentMethodIcons: Record<string, React.ElementType> = {
  'cash': Banknote,
  'credit': CreditCard,
  'debit': Wallet,
  'transfer': ArrowRightLeft,
  'other': MoreHorizontal,
};

const paymentMethods = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'credit', label: 'Tarjeta de Crédito' },
  { value: 'debit', label: 'Tarjeta de Débito' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'other', label: 'Otro' },
];

export default function ExpensesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newExpense, setNewExpense] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    description: '',
    paymentMethod: ''
  });

  const expenseTransactions = recentTransactions.filter(t => t.type === 'expense');
  const totalExpenses = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);
  
  const filteredTransactions = expenseTransactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || t.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by category for stats
  const expensesByCategory = expenseTransactions.reduce((acc, t) => {
    acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  // Group by payment method
  const expensesByMethod = expenseTransactions.reduce((acc, t) => {
    const method = t.paymentMethod || 'other';
    acc[method] = (acc[method] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleCreateExpense = () => {
    // Here you would save to backend
    setIsDialogOpen(false);
    setNewExpense({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      categoryId: '',
      description: '',
      paymentMethod: ''
    });
  };

  return (
    <>
      <DashboardHeader 
        title="Gastos" 
        subtitle="Registra y controla tus gastos"
      />
      
      <main className="flex-1 p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total del Mes
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses, mockUser.currency)}</div>
              <div className="flex items-center gap-1 mt-2">
                <ArrowDownRight className="h-3 w-3 text-success" />
                <span className="text-xs text-success">-8% vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transacciones
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expenseTransactions.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Gastos registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Promedio por Gasto
              </CardTitle>
              <Calendar className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalExpenses / Math.max(1, expenseTransactions.length), mockUser.currency)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Este mes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Expenses by Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Por Método de Pago</CardTitle>
            <CardDescription>Cómo estás pagando tus gastos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4">
              {paymentMethods.map((method) => {
                const amount = expensesByMethod[method.value] || 0;
                const percentage = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
                const IconComponent = paymentMethodIcons[method.value];
                
                return (
                  <div 
                    key={method.value}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{method.label}</p>
                        <p className="text-xs text-muted-foreground">{percentage}%</p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatCurrency(amount, mockUser.currency)}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoría</CardTitle>
            <CardDescription>Dónde estás gastando más</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {expenseCategories
                .map((category) => ({
                  ...category,
                  amount: expensesByCategory[category.id] || 0
                }))
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 8)
                .map((category) => {
                  const percentage = totalExpenses > 0 ? Math.round((category.amount / totalExpenses) * 100) : 0;
                  const IconComponent = iconMap[category.icon] || MoreHorizontal;
                  
                  return (
                    <div 
                      key={category.id}
                      className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <IconComponent className="h-5 w-5" style={{ color: category.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{category.name}</p>
                          <p className="text-xs text-muted-foreground">{percentage}%</p>
                        </div>
                      </div>
                      <p className="text-lg font-semibold">
                        {formatCurrency(category.amount, mockUser.currency)}
                      </p>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Lista de Gastos</CardTitle>
              <CardDescription>Todos tus gastos registrados</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-48"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Gasto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Gasto</DialogTitle>
                    <DialogDescription>
                      Agrega un nuevo gasto a tu registro
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Monto ({mockUser.currency})</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Fecha</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newExpense.date}
                          onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Categoría</Label>
                        <Select 
                          value={newExpense.categoryId} 
                          onValueChange={(value) => setNewExpense({ ...newExpense, categoryId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {expenseCategories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Método de Pago</Label>
                        <Select 
                          value={newExpense.paymentMethod} 
                          onValueChange={(value) => setNewExpense({ ...newExpense, paymentMethod: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((method) => (
                              <SelectItem key={method.value} value={method.value}>
                                {method.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                        placeholder="Ej: Compra en supermercado, pago de servicio..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateExpense} disabled={!newExpense.amount || !newExpense.categoryId}>
                      Registrar Gasto
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingDown className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No hay gastos que coincidan con tu búsqueda</p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => {
                  const category = getCategoryById(transaction.categoryId);
                  const IconComponent = iconMap[category?.icon || ''] || MoreHorizontal;
                  const PaymentIcon = paymentMethodIcons[transaction.paymentMethod || 'other'];
                  const paymentLabel = paymentMethods.find(m => m.value === transaction.paymentMethod)?.label || 'Otro';
                  
                  return (
                    <div 
                      key={transaction.id} 
                      className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${category?.color}20` }}
                      >
                        <IconComponent className="h-6 w-6" style={{ color: category?.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{transaction.description}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {category?.name}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <PaymentIcon className="h-3 w-3" />
                            <span>{paymentLabel}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString('es-MX', { 
                              day: 'numeric', 
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-destructive">
                          -{formatCurrency(transaction.amount, mockUser.currency)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
