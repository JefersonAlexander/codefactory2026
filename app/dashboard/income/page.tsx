"use client";

import { useEffect, useMemo, useState, type ElementType } from "react";
import {
  ArrowUpRight,
  Calendar,
  DollarSign,
  Filter,
  Loader2,
  MoreHorizontal,
  Pencil,
  PiggyBank,
  Plus,
  Search,
  Tag,
  Trash2,
  TrendingUp,
  Wallet,
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
import { useIncomes } from "@/hooks/useIncomes";
import { formatCurrency } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const incomeCategories = [
  { id: 1, name: "Salario", icon: "wallet", color: "#22c55e" },
  { id: 2, name: "Freelance", icon: "trendingUp", color: "#3b82f6" },
  { id: 3, name: "Inversiones", icon: "piggyBank", color: "#a855f7" },
  { id: 4, name: "Otros", icon: "moreHorizontal", color: "#6b7280" },
];

const fallbackIncomeCategory = {
  id: 0,
  name: "Sin categoria",
  icon: "tag",
  color: "#6b7280",
};

type User = {
  nombre: string;
  email: string;
  currency: string;
};

type IncomeFormState = {
  amount: string;
  date: string;
  categoryId: string;
  description: string;
};

const iconMap: Record<string, ElementType> = {
  wallet: Wallet,
  trendingUp: TrendingUp,
  piggyBank: PiggyBank,
  moreHorizontal: MoreHorizontal,
  tag: Tag,
};

const getDefaultIncomeForm = (): IncomeFormState => ({
  amount: "",
  date: new Date().toISOString().split("T")[0],
  categoryId: "",
  description: "",
});

export default function IncomePage() {
  const [user, setUser] = useState<User>({
    nombre: "Usuario",
    email: "",
    currency: "COP",
  });

  const { incomes, loading, addIncome, editIncome, removeIncome } =
    useIncomes();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [incomeForm, setIncomeForm] = useState<IncomeFormState>(
    getDefaultIncomeForm
  );
  const [editingIncomeId, setEditingIncomeId] = useState<number | null>(null);
  const [incomeToDelete, setIncomeToDelete] = useState<number | null>(null);
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

  const selectedIncomeToDelete = incomes.find(
    (income) => income.id === incomeToDelete
  );

  const totalIncome = useMemo(
    () => incomes.reduce((sum, income) => sum + income.valor, 0),
    [incomes]
  );

  const incomeCategorySummary = useMemo(() => {
    const groupedIncome = incomes.reduce((acc, income) => {
      const categoryId = Number(income.idCategoria);
      const category = incomeCategories.find(
        (category) => category.id === categoryId
      );

      console.log("Income:", income);
      console.log("idCategoria:", income.idCategoria);
      console.log("Category encontrada:", category);

      if (!acc[categoryId]) {
        acc[categoryId] = 0;
      }

      acc[categoryId] += income.valor;

      return acc;
    }, {} as Record<number, number>);

    const knownCategorySummaries = incomeCategories.map((category) => {
      const amount = groupedIncome[category.id] || 0;
      const percentage =
        totalIncome > 0 ? (amount / totalIncome) * 100 : 0;

      return {
        ...category,
        amount,
        percentage,
      };
    });

    const unknownCategorySummaries = Object.entries(groupedIncome)
      .filter(
        ([categoryId]) =>
          !incomeCategories.find(
            (category) => category.id === Number(categoryId)
          )
      )
      .map(([categoryId, amount]) => ({
        ...fallbackIncomeCategory,
        id: Number(categoryId),
        amount,
        percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0,
      }));

    return [...knownCategorySummaries, ...unknownCategorySummaries];
  }, [incomes, totalIncome]);

  const filteredIncomes = incomes.filter((income) => {
    const matchesSearch = income.descripcion
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || income.idCategoria === Number(filterCategory);

    return matchesSearch && matchesCategory;
  });

  const resetIncomeForm = () => {
    setIncomeForm(getDefaultIncomeForm());
    setEditingIncomeId(null);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (isSaving) return;

    setIsDialogOpen(open);

    if (!open) {
      resetIncomeForm();
    }
  };

  const handleOpenCreateDialog = () => {
    resetIncomeForm();
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (income: (typeof incomes)[number]) => {
    setEditingIncomeId(income.id);
    setIncomeForm({
      amount: String(income.valor),
      date: income.fecha.split("T")[0],
      categoryId: String(income.idCategoria),
      description: income.descripcion,
    });
    setIsDialogOpen(true);
  };

  const handleSaveIncome = async () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      toast({
        title: "No se pudo guardar",
        description: "Debes iniciar sesion para registrar ingresos.",
        variant: "destructive",
      });
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    const payload = {
      valor: Number(incomeForm.amount),
      fecha: incomeForm.date,
      descripcion: incomeForm.description,
      idUsuario: parsedUser.id,
      idCategoria: Number(incomeForm.categoryId),
    };

    setIsSaving(true);

    try {
      if (editingIncomeId) {
        await editIncome(editingIncomeId, payload);
        toast({
          title: "Ingreso actualizado",
          description: "Los cambios se reflejaron en tus resumenes.",
        });
      } else {
        await addIncome(payload);
        toast({
          title: "Ingreso registrado",
          description: "El nuevo ingreso se agrego correctamente.",
        });
      }

      setIsDialogOpen(false);
      resetIncomeForm();
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

  const handleDeleteIncome = async () => {
    if (!incomeToDelete) return;

    setIsDeleting(true);

    try {
      await removeIncome(incomeToDelete);
      toast({
        title: "Ingreso eliminado",
        description: "La lista y los resumenes se actualizaron.",
      });
      setIncomeToDelete(null);
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
    return <p>Cargando ingresos...</p>;
  }

  return (
    <>
      <DashboardHeader
        title="Ingresos"
        subtitle={`Registra y gestiona tus ingresos, ${user.nombre}`}
      />

      <main className="flex-1 p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total del Mes
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(totalIncome, user.currency)}
              </div>

              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-xs text-success">
                  +12% vs mes anterior
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
              <div className="text-2xl font-bold">{incomes.length}</div>

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
                {formatCurrency(
                  totalIncome / Math.max(1, incomes.length),
                  user.currency
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-2">Este mes</p>
            </CardContent>
          </Card>
        </div>


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

                  {incomeCategories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                  <Button onClick={handleOpenCreateDialog} disabled={isDeleting}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Ingreso
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingIncomeId ? "Editar Ingreso" : "Registrar Ingreso"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingIncomeId
                        ? "Actualiza la informacion del ingreso seleccionado"
                        : "Agrega un nuevo ingreso a tu registro"}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Monto ({user.currency})</Label>

                        <Input
                          id="amount"
                          type="number"
                          value={incomeForm.amount}
                          onChange={(e) =>
                            setIncomeForm({
                              ...incomeForm,
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
                          value={incomeForm.date}
                          onChange={(e) =>
                            setIncomeForm({
                              ...incomeForm,
                              date: e.target.value,
                            })
                          }
                          disabled={isSaving}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Categoria</Label>

                      <Select
                        value={incomeForm.categoryId}
                        onValueChange={(value) =>
                          setIncomeForm({
                            ...incomeForm,
                            categoryId: value,
                          })
                        }
                        disabled={isSaving}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoria" />
                        </SelectTrigger>

                        <SelectContent>
                          {incomeCategories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripcion</Label>

                      <Textarea
                        id="description"
                        value={incomeForm.description}
                        onChange={(e) =>
                          setIncomeForm({
                            ...incomeForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Ej: Salario mensual, pago de proyecto..."
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
                      onClick={handleSaveIncome}
                      disabled={
                        isSaving || !incomeForm.amount || !incomeForm.categoryId
                      }
                    >
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                      {editingIncomeId ? "Guardar Cambios" : "Registrar Ingreso"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {filteredIncomes.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />

                  <p className="text-muted-foreground">
                    No hay ingresos que coincidan con tu busqueda
                  </p>
                </div>
              ) : (
                filteredIncomes.map((income) => (
                  <div
                    key={income.id}
                    className="flex flex-col gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {income.descripcion}
                        </p>

                        <span className="text-xs text-muted-foreground">
                          {new Date(income.fecha).toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <p className="text-lg font-semibold text-success whitespace-nowrap">
                        +{formatCurrency(income.valor, user.currency)}
                      </p>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditDialog(income)}
                          disabled={isSaving || isDeleting}
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setIncomeToDelete(income.id)}
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
        open={incomeToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setIncomeToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar ingreso</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion eliminara
              {selectedIncomeToDelete
                ? ` "${selectedIncomeToDelete.descripcion}"`
                : " este ingreso"}
              . La lista, resumenes y balances se actualizaran inmediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: "destructive" }))}
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                handleDeleteIncome();
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
