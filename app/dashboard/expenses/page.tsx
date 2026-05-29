"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  Calendar,
  DollarSign,
  Filter,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  TrendingDown,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DashboardHeader } from "@/components/dashboard-header";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/useCategory";
import { useExpenses } from "@/hooks/useExpenses";
import { formatCurrency } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type User = {
  nombre: string;
  email: string;
  currency: string;
};

type ExpenseFormState = {
  amount: string;
  date: string;
  description: string;
  categoryId: string;
};

const getDefaultExpenseForm = (): ExpenseFormState => ({
  amount: "",
  date: new Date().toISOString().split("T")[0],
  description: "",
  categoryId: "",
});

export default function ExpensesPage() {
  const [user, setUser] = useState<User>({
    nombre: "Usuario",
    email: "",
    currency: "COP",
  });

  const {
    expenses,
    totalExpenses,
    loading,
    addExpenses,
    editExpenses,
    removeExpenses,
  } = useExpenses();
  const { categories } = useCategories();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [expenseForm, setExpenseForm] = useState<ExpenseFormState>(
    getDefaultExpenseForm
  );
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const selectedExpenseToDelete = expenses.find(
    (expense) => expense.id === expenseToDelete
  );

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
      filterCategory === "all" || expense.idCategoria === Number(filterCategory);

    return matchesSearch && matchesCategory;
  });

  const resetExpenseForm = () => {
    setExpenseForm(getDefaultExpenseForm());
    setEditingExpenseId(null);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (isSaving) return;

    setIsDialogOpen(open);

    if (!open) {
      resetExpenseForm();
    }
  };

  const handleOpenCreateDialog = () => {
    resetExpenseForm();
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (expense: (typeof expenses)[number]) => {
    setEditingExpenseId(expense.id);
    setExpenseForm({
      amount: String(expense.valor),
      date: expense.fecha.split("T")[0],
      description: expense.descripcion,
      categoryId: String(expense.idCategoria),
    });
    setIsDialogOpen(true);
  };

  const handleSaveExpense = async () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      toast({
        title: "No se pudo guardar",
        description: "Debes iniciar sesion para registrar gastos.",
        variant: "destructive",
      });
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    const payload = {
      valor: Number(expenseForm.amount),
      fecha: expenseForm.date,
      descripcion: expenseForm.description,
      idUsuario: parsedUser.id,
      idCategoria: Number(expenseForm.categoryId),
    };

    setIsSaving(true);

    try {
      if (editingExpenseId !== null) {
        await editExpenses(editingExpenseId, payload);
        toast({
          title: "Gasto actualizado",
          description: "Los cambios se reflejaron en tus resumenes.",
        });
      } else {
        await addExpenses(payload);
        toast({
          title: "Gasto registrado",
          description: "El nuevo gasto se agrego correctamente.",
        });
      }

      setIsDialogOpen(false);
      resetExpenseForm();
    } catch {
      toast({
        title: "No se pudo guardar",
        description: "Intenta nuevamente en unos segundos.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (expenseToDelete === null) return;

    setIsDeleting(true);

    try {
      await removeExpenses(expenseToDelete);
      toast({
        title: "Gasto eliminado",
        description: "La lista, resumenes y presupuestos se actualizaron.",
      });
      setExpenseToDelete(null);
    } catch {
      toast({
        title: "No se pudo eliminar",
        description: "Intenta nuevamente en unos segundos.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
                <span className="text-xs text-success" />
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
              <div className="text-2xl font-bold">{expenses.length}</div>
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
            <CardTitle>Gastos por Categoria</CardTitle>
            <CardDescription>Donde estas gastando mas</CardDescription>
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

                  return (
                    <div
                      key={category.id}
                      className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
                          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
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
                  disabled={isSaving || isDeleting}
                />
              </div>

              <Select
                value={filterCategory}
                onValueChange={setFilterCategory}
                disabled={isSaving || isDeleting}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>

                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                  <Button onClick={handleOpenCreateDialog} disabled={isDeleting}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Gasto
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingExpenseId !== null
                        ? "Editar Gasto"
                        : "Registrar Gasto"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingExpenseId !== null
                        ? "Actualiza la informacion del gasto seleccionado"
                        : "Agrega un nuevo gasto a tu registro"}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Monto ({user.currency})</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={expenseForm.amount}
                          onChange={(e) =>
                            setExpenseForm({
                              ...expenseForm,
                              amount: e.target.value,
                            })
                          }
                          placeholder="0.00"
                          disabled={isSaving}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date">Fecha</Label>
                        <Input
                          id="date"
                          type="date"
                          value={expenseForm.date}
                          onChange={(e) =>
                            setExpenseForm({
                              ...expenseForm,
                              date: e.target.value,
                            })
                          }
                          disabled={isSaving}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Categoria</Label>

                        <Select
                          value={expenseForm.categoryId}
                          onValueChange={(value) =>
                            setExpenseForm({
                              ...expenseForm,
                              categoryId: value,
                            })
                          }
                          disabled={isSaving}
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
                      <Label htmlFor="description">Descripcion</Label>
                      <Textarea
                        id="description"
                        value={expenseForm.description}
                        onChange={(e) =>
                          setExpenseForm({
                            ...expenseForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Ej: Compra en supermercado, pago de servicio..."
                        disabled={isSaving}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => handleDialogOpenChange(false)}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>

                    <Button
                      onClick={handleSaveExpense}
                      disabled={
                        isSaving || !expenseForm.amount || !expenseForm.categoryId
                      }
                    >
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                      {editingExpenseId !== null
                        ? "Guardar Cambios"
                        : "Registrar Gasto"}
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
                    No hay gastos que coincidan con tu busqueda
                  </p>
                </div>
              ) : (
                filteredTransactions.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex flex-col gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow sm:flex-row sm:items-center"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {expense.descripcion}
                      </p>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-muted-foreground">
                          {new Date(expense.fecha).toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <p className="text-lg font-semibold text-destructive whitespace-nowrap">
                        -{formatCurrency(expense.valor, user.currency)}
                      </p>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditDialog(expense)}
                          disabled={isSaving || isDeleting}
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setExpenseToDelete(expense.id)}
                          disabled={isSaving || isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <AlertDialog
        open={expenseToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setExpenseToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar gasto</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion eliminara
              {selectedExpenseToDelete
                ? ` "${selectedExpenseToDelete.descripcion}"`
                : " este gasto"}
              . La lista, resumenes, balances y presupuestos se actualizaran
              inmediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: "destructive" }))}
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                handleDeleteExpense();
              }}
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
