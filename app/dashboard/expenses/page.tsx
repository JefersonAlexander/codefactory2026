"use client";

import { useEffect, useState, type ElementType } from "react";
import {
  Plus,
  TrendingDown,
  Calendar,
  DollarSign,
  Search,
  Filter,
  ArrowDownRight,
  Utensils,
  Car,
  Home,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  PiggyBank,
  MoreHorizontal,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  expenseCategories,
  formatCurrency,
} from "@/lib/mock-data";


import {useExpenses} from "@/hooks/useExpenses"
import {useCategories} from "@/hooks/useCategory"




type User = {
  nombre: string;
  email: string;
  currency: string;
};

const iconMap: Record<string, ElementType> = {
  utensils: Utensils,
  car: Car,
  home: Home,
  gamepad: Gamepad2,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  "piggy-bank": PiggyBank,
  ellipsis: MoreHorizontal,
};



export default function ExpensesPage() {

  const [user, setUser] = useState<User>({
    nombre: "Usuario",
    email: "",
    currency: "COP",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const{expenses,setExpenses,totalExpenses,loading,loadIExpenses,addExpenses,editExpenses}= useExpenses();
  const {categories,loadCategories,addCategory,editCategory,removeCategory,} = useCategories();

  const [newExpense, setNewExpense] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    categoryId: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setUser({
        nombre: parsedUser.nombre || "Usuario",
        email: parsedUser.email || "",
        currency: parsedUser.currency || "COP",
      });
    }
  }, []);

  const expensesByCategory = expenses.reduce<Record<number, number>>(
  (acc, expense) => {
    acc[expense.idCategoria] =
      (acc[expense.idCategoria] || 0) + expense.valor;

    return acc;
  },
  {}
);

  


  const filteredTransactions = expenses.filter((expense) => {
    const matchesSearch = expense.descripcion
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" ||
      expense.idCategoria === Number(filterCategory);

    return matchesSearch && matchesCategory;
  });

  

  const handleCreateExpense = async () => { 
    const storedUser = localStorage.getItem("user");  
    if (!storedUser) return; 
    const parsedUser = JSON.parse(storedUser); 
      await addExpenses({    
          valor: Number(newExpense.amount),
          fecha: newExpense.date,  
          descripcion: newExpense.description,    
          idUsuario: parsedUser.id,    
          idCategoria: Number(newExpense.categoryId),
          }); 
        setIsDialogOpen(false);  setNewExpense({   
            amount: "",
            date: new Date().toISOString().split("T")[0], 
            description: "",
            categoryId: ""  
          });};

  if (loading) {
    return <p>Cargando gastos...</p>;
  }

  return (
    <>
      <DashboardHeader
        title="Gastos"
        subtitle={`Registra y controla tus gastos, ${user.nombre}`}
      />

      <main className="flex-1 p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total del Mes
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(totalExpenses, user.currency)}
              </div>

              <div className="flex items-center gap-1 mt-2">
                <ArrowDownRight className="h-3 w-3 text-success" />
                <span className="text-xs text-success">
                </span>
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
              <div className="text-2xl font-bold">
                {expenses.length}
              </div>
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
                {formatCurrency(
                  totalExpenses / Math.max(1, expenses.length),
                  user.currency
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Este mes</p>
            </CardContent>
          </Card>
        </div>


       <Card>
  <CardHeader>
    <CardTitle>Gastos por Categoría</CardTitle>
    <CardDescription>Dónde estás gastando más</CardDescription>
  </CardHeader>

  <CardContent>
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {categories
        .map((category) => ({
          ...category,
          amount: expensesByCategory[category.id] || 0,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 8)
        .map((category) => {
          const percentage =
            totalExpenses > 0
              ? Math.round((category.amount / totalExpenses) * 100)
              : 0;

          const IconComponent = MoreHorizontal;

          return (
            <div
              key={category.id}
              className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {category.nombre}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {percentage}%
                  </p>
                </div>
              </div>

              <p className="text-lg font-semibold">
                {formatCurrency(category.amount, user.currency)}
              </p>
            </div>
          );
        })}
    </div>
  </CardContent>
</Card>


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

                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={String(category.id)}
                  >
                    {category.nombre}
                  </SelectItem>
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
                        <Label htmlFor="amount">
                          Monto ({user.currency})
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          value={newExpense.amount}
                          onChange={(e) =>
                            setNewExpense({
                              ...newExpense,
                              amount: e.target.value,
                            })
                          }
                          placeholder="0.00"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date">Fecha</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newExpense.date}
                          onChange={(e) =>
                            setNewExpense({
                              ...newExpense,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Categoría</Label>

                        <Select
                          value={newExpense.categoryId}
                          onValueChange={(value) =>
                            setNewExpense({
                              ...newExpense,
                              categoryId: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>

                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={String(category.id)}
                              >
                                {category.nombre}
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
                        onChange={(e) =>
                          setNewExpense({
                            ...newExpense,
                            description: e.target.value,
                          })
                        }
                        placeholder="Ej: Compra en supermercado, pago de servicio..."
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>

                    <Button
                      onClick={handleCreateExpense}
                      disabled={!newExpense.amount || !newExpense.categoryId}
                    >
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
                  <p className="text-muted-foreground">
                    No hay gastos que coincidan con tu búsqueda
                  </p>
                </div>
              ) : (
                filteredTransactions.map((expenses) => {
                  
                  
                  return (
                    <div
                      key={expenses.id}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                     

                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {expenses.descripcion}
                        </p>

                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          

                      
                          <span className="text-xs text-muted-foreground">
                            {new Date(expenses.fecha).toLocaleDateString(
                              "es-MX",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold text-destructive">
                          -{formatCurrency(expenses.valor, user.currency)}
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
