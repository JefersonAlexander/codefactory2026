"use client";

import { useState } from "react";
import { 
  Plus, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Search,
  Filter,
  ArrowUpRight,
  Briefcase,
  Laptop,
  Gift,
  PlusCircle,
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
  incomeCategories, 
  formatCurrency,
  getCategoryById,
  getMonthName,
  mockUser 
} from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
  'briefcase': Briefcase,
  'laptop': Laptop,
  'trending-up': TrendingUp,
  'gift': Gift,
  'plus-circle': PlusCircle,
};

export default function IncomePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newIncome, setNewIncome] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    description: ''
  });

  const incomeTransactions = recentTransactions.filter(t => t.type === 'income');
  const totalIncome = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);
  
  const filteredTransactions = incomeTransactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || t.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by category for stats
  const incomeByCategory = incomeTransactions.reduce((acc, t) => {
    acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleCreateIncome = () => {
    // Here you would save to backend
    setIsDialogOpen(false);
    setNewIncome({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      categoryId: '',
      description: ''
    });
  };

  return (
    <>
      <DashboardHeader 
        title="Ingresos" 
        subtitle="Registra y gestiona tus ingresos"
      />
      
      <main className="flex-1 p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total del Mes
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{formatCurrency(totalIncome, mockUser.currency)}</div>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-xs text-success">+12% vs mes anterior</span>
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
              <div className="text-2xl font-bold">{incomeTransactions.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Ingresos registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Promedio por Ingreso
              </CardTitle>
              <Calendar className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalIncome / Math.max(1, incomeTransactions.length), mockUser.currency)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Este mes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Income by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos por Categoría</CardTitle>
            <CardDescription>Distribución de tus fuentes de ingreso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
              {incomeCategories.map((category) => {
                const amount = incomeByCategory[category.id] || 0;
                const percentage = totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0;
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
                    <p className="text-lg font-semibold text-success">
                      {formatCurrency(amount, mockUser.currency)}
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
              <CardTitle>Lista de Ingresos</CardTitle>
              <CardDescription>Todos tus ingresos registrados</CardDescription>
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
                  {incomeCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Ingreso
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Ingreso</DialogTitle>
                    <DialogDescription>
                      Agrega un nuevo ingreso a tu registro
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Monto ({mockUser.currency})</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={newIncome.amount}
                          onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Fecha</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newIncome.date}
                          onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Categoría</Label>
                      <Select 
                        value={newIncome.categoryId} 
                        onValueChange={(value) => setNewIncome({ ...newIncome, categoryId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {incomeCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={newIncome.description}
                        onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                        placeholder="Ej: Salario mensual, pago de proyecto..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateIncome} disabled={!newIncome.amount || !newIncome.categoryId}>
                      Registrar Ingreso
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
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No hay ingresos que coincidan con tu búsqueda</p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => {
                  const category = getCategoryById(transaction.categoryId);
                  const IconComponent = iconMap[category?.icon || ''] || MoreHorizontal;
                  
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
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {category?.name}
                          </Badge>
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
                        <p className="text-lg font-semibold text-success">
                          +{formatCurrency(transaction.amount, mockUser.currency)}
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
