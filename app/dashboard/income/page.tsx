"use client";

import { useEffect, useState, type ElementType } from "react";
import {Plus,TrendingUp,Calendar,DollarSign,Search,Filter,ArrowUpRight,Wallet,PiggyBank,MoreHorizontal,} from "lucide-react";

import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";

import { DashboardHeader } from "@/components/dashboard-header";
import {formatCurrency} from "@/lib/mock-data";
import { useIncomes } from "@/hooks/useIncomes";

const incomeCategories = [
  { id: 1, name: "Salario", icon: "wallet", color: "#22c55e" },
  { id: 2, name: "Freelance", icon: "trendingUp", color: "#3b82f6" },
  { id: 3, name: "Inversiones", icon: "piggyBank", color: "#a855f7" },
  { id: 4, name: "Otros", icon: "moreHorizontal", color: "#6b7280" },
];

type User = { 
  nombre: string;
  email: string;
  currency: string;
};

const iconMap: Record<string, ElementType> = {
  wallet: Wallet,
  trendingUp: TrendingUp,
  piggyBank: PiggyBank,
  moreHorizontal: MoreHorizontal,
};

export default function IncomePage() {

  const [user, setUser] = useState<User>({
    nombre: "Usuario",
    email: "",
    currency: "COP",
  });

  const {incomes,totalIncome,loading,addIncome,editIncome,} = useIncomes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [newIncome, setNewIncome] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    categoryId: "",
    description: "",
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

  

  const filteredIncomes = incomes.filter((income) => {
  const matchesSearch = income.descripcion
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesCategory =
    filterCategory === "all" ||
    income.idCategoria === Number(filterCategory);

  return matchesSearch && matchesCategory;
});
  
  
const handleCreateIncome = async () => { 
    const storedUser = localStorage.getItem("user");  
    if (!storedUser) return; 
    const parsedUser = JSON.parse(storedUser); 
      await addIncome({    
          valor: Number(newIncome.amount), 
          fecha: newIncome.date,    
          descripcion: newIncome.description,    
          idUsuario: parsedUser.id,    
          idCategoria: Number(newIncome.categoryId),  }); 
        setIsDialogOpen(false);  setNewIncome({   
            amount: "",
            date: new Date().toISOString().split("T")[0], 
          categoryId: "",    
          description: "",  
        });};


  if (loading) {
    return <p>Cargando ingresos...</p>;
  }

  const incomeByCategory = incomes.reduce(
  (acc, income) => {
    acc[income.idCategoria] =
      (acc[income.idCategoria] || 0) +
      income.valor;

    return acc;
  },
  {} as Record<number, number>
);

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
              <div className="text-2xl font-bold">
                {incomes.length}
              </div>

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
  <CardHeader>
    <CardTitle>
      Ingresos por Categoría
    </CardTitle>

    <CardDescription>
      Distribución de tus fuentes de ingreso
    </CardDescription>
  </CardHeader>

  <CardContent>
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
      {incomeCategories.map((category) => {

        // Total de ingresos de la categoría
        const amount =
          incomeByCategory[category.id] || 0;

        // Porcentaje respecto al total
        const percentage =
          totalIncome > 0
            ? Math.round(
                (amount / totalIncome) * 100
              )
            : 0;

        // Icono correspondiente
        const IconComponent =
          iconMap[category.icon] ||
          MoreHorizontal;

        return (
          <div
            key={category.id}
            className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              
              {/* Icono */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor:
                    `${category.color}20`,
                }}
              >
                <IconComponent
                  className="h-5 w-5"
                  style={{
                    color: category.color,
                  }}
                />
              </div>

              {/* Nombre y porcentaje */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {category.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {percentage}%
                </p>
              </div>
            </div>

            {/* Valor */}
            <p className="text-lg font-semibold text-success">
              {formatCurrency(
                amount,
                user.currency
              )}
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
              <CardTitle>Lista de Ingresos</CardTitle>
              <CardDescription>
                Todos tus ingresos registrados
              </CardDescription>
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
                        <SelectItem value="all">
                          Todas
                        </SelectItem>

                        {incomeCategories.map((cat) => (
                          <SelectItem
                            key={cat.id}
                            value={String(cat.id)}
                          >
                            {cat.name}
                          </SelectItem>
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
                        <Label htmlFor="amount">
                          Monto ({user.currency})
                        </Label>

                        <Input
                          id="amount"
                          type="number"
                          value={newIncome.amount}
                          onChange={(e) =>
                            setNewIncome({
                              ...newIncome,
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
                          value={newIncome.date}
                          onChange={(e) =>
                            setNewIncome({
                              ...newIncome,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Categoría</Label>

                      <Select
                        value={newIncome.categoryId}
                        onValueChange={(value) =>
                          setNewIncome({
                            ...newIncome,
                            categoryId: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>

                        <SelectContent>
                          {incomeCategories.map((cat) => (
                            <SelectItem
                              key={cat.id}
                              value={String(cat.id)}
                            >
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>

                      <Textarea
                        id="description"
                        value={newIncome.description}
                        onChange={(e) =>
                          setNewIncome({
                            ...newIncome,
                            description: e.target.value,
                          })
                        }
                        placeholder="Ej: Salario mensual, pago de proyecto..."
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
                      onClick={handleCreateIncome}
                      disabled={!newIncome.amount || !newIncome.categoryId}
                    >
                      Registrar Ingreso
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
          No hay ingresos que coincidan con tu búsqueda
        </p>
      </div>
    ) : (
      filteredIncomes.map((income) => {
        return (
          <div
            key={income.id}
            className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
          >
            {/* Icono genérico */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100"
            >
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>

            {/* Información del ingreso */}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {income.descripcion}
              </p>

              <span className="text-xs text-muted-foreground">
                {new Date(income.fecha).toLocaleDateString(
                  "es-MX",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </span>
            </div>

            {/* Valor */}
            <div className="text-right">
              <p className="text-lg font-semibold text-success">
                +{formatCurrency(income.valor, user.currency)}
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