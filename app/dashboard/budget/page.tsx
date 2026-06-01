"use client";

import { useEffect, useState } from "react";
import { Wallet, Edit2, Save, TrendingUp, TrendingDown,AlertCircle,CheckCircle2,ChevronLeft,ChevronRight
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DashboardHeader } from "@/components/dashboard-header";
import {  expenseCategories, formatCurrency, getMonthName, } from "@/lib/mock-data"; 
import {PieChart,Pie,Cell,ResponsiveContainer,Tooltip} from "recharts";

import {crearPresupuesto,actualizarPresupuesto} from "@/src/services/presupuestoService";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { useBudget } from "@/hooks/useBudget";
import { useCategoryReport } from "@/hooks/useCategoryReport";

type User = {
  nombre: string;
  email: string;
  currency: string;
};

export default function BudgetPage() {
  const [user, setUser] = useState<User>({
    nombre: "Usuario",
    email: "",
    currency: "COP",
  });

 
  
const [isDialogOpen, setIsDialogOpen] = useState(false);


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


const {totalIncome,totalExpenses,} = useFinancialSummary();
const {presupuesto,setPresupuesto,editBudget,setEditBudget} = useBudget();
const {
  report: categoryReport,
  loading: loadingCategoryReport,
  error: categoryReportError,
  fetchReport: fetchCategoryReport,
} = useCategoryReport();
const [hasRequestedCategoryReport, setHasRequestedCategoryReport] =
  useState(false);
const [categoryReportStartDate, setCategoryReportStartDate] =
  useState("2026-05-01");
const [categoryReportEndDate, setCategoryReportEndDate] =
  useState("2026-05-31");


const valor = Number(presupuesto?.valor || 0);
const totalSpent = totalExpenses; 
const remaining = valor - totalSpent;
const budgetPercentage =
    valor > 0 ? Math.round((totalSpent / valor) * 100) : 0;
const unallocated = totalIncome;

  

const handleSaveBudget = async () => {
  const newBudget = parseFloat(editBudget);

  if (isNaN(newBudget) || newBudget <= 0) return;

  try {
    const data = presupuesto
      ? await actualizarPresupuesto(newBudget)
      : await crearPresupuesto(newBudget);

    setPresupuesto(data);
    setEditBudget(String(data.valor));
    setIsDialogOpen(false);
  } catch (error) {
    console.error("Error guardando presupuesto:", error);
  }
};

const pieData = [
    { name: "Gastado", value: totalSpent, color: "#E46212" },
    { name: "Disponible", value: Math.max(0, remaining), color: "#22c55e" },
  ];
   


const fechapresupuesto = presupuesto?.fecha
? new Date(presupuesto.fecha)
: null;

const month = fechapresupuesto ? fechapresupuesto.getMonth() + 2 : 0;
const year = fechapresupuesto ? fechapresupuesto.getFullYear() : 0;

const handleFetchCategoryReport = () => {
  if (!categoryReportStartDate || !categoryReportEndDate) return;

  console.log("Fecha inicio:", categoryReportStartDate);
  console.log("Fecha fin:", categoryReportEndDate);

  setHasRequestedCategoryReport(true);

  fetchCategoryReport(categoryReportStartDate, categoryReportEndDate);
};

useEffect(() => {
  handleFetchCategoryReport();
}, []);

const categoryReportItems = categoryReport?.categoryExpenses ?? [];
const categoryReportTotal = categoryReport?.totalExpenses ?? 0;

  return (
    <>
      <DashboardHeader 
        title="Presupuesto Mensual" 
        subtitle="Gestiona tu presupuesto y categorías"
      />
      
      <main className="flex-1 p-6 space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 py-2 rounded-lg bg-muted font-semibold">
              {getMonthName(month)} {year}
            </div>
            <Button variant="outline" size="icon" >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Edit2 className="h-4 w-4 mr-2" />
                Editar Presupuesto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Presupuesto Mensual</DialogTitle>
                <DialogDescription>
                  Define el presupuesto total para {getMonthName(month)} {year}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Presupuesto Total ({user.currency})</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    placeholder="Ingresa el presupuesto"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Este es el monto total que planeas usar este mes. Luego podrás distribuirlo entre categorías.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveBudget}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Presupuesto Total
              </CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"> {formatCurrency(valor ?? 0, user.currency || "COP")}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Para {getMonthName(month)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Gastado
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{formatCurrency(totalSpent, user.currency)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {budgetPercentage}% del presupuesto
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Disponible
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(remaining, user.currency)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {100 - budgetPercentage}% restante
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Ingresado
              </CardTitle>
              {unallocated > 0 ? (
                <AlertCircle className="h-4 w-4 text-warning" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-success" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${unallocated > 0 ? 'text-warning' : 'text-success'}`}>
                {formatCurrency(unallocated, user.currency)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {unallocated > 0 ? 'Por distribuir' : 'Todo asignado'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Overview */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Uso del Presupuesto</CardTitle>
              <CardDescription>Progreso del mes actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value, user.currency)}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span className="font-semibold">{budgetPercentage}%</span>
                    </div>
                    <Progress value={budgetPercentage} className="h-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span>Gastado</span>
                    </div>
                    <span className="font-medium">{formatCurrency(totalSpent, user.currency)}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span>Disponible</span>
                    </div>
                    <span className="font-medium">{formatCurrency(remaining, user.currency)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Status */}
          <Card>
            <CardHeader>
              <CardTitle>Estado del Presupuesto</CardTitle>
              <CardDescription>Análisis de tu situación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg ${
                budgetPercentage < 50 ? 'bg-success/10 border border-success/20' :
                budgetPercentage < 80 ? 'bg-warning/10 border border-warning/20' :
                'bg-destructive/10 border border-destructive/20'
              }`}>
                <div className="flex items-center gap-3">
                  {budgetPercentage < 50 ? (
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  ) : budgetPercentage < 80 ? (
                    <AlertCircle className="h-8 w-8 text-warning" />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  )}
                  <div>
                    <h4 className="font-semibold">
                      {budgetPercentage < 50 ? '¡Excelente control!' :
                       budgetPercentage < 80 ? 'Vas bien, pero cuidado' :
                       'Atención: presupuesto casi agotado'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {budgetPercentage < 50 ? 
                        'Has usado menos de la mitad de tu presupuesto. ¡Sigue así!' :
                       budgetPercentage < 80 ? 
                        'Has usado más del 50%. Revisa tus gastos restantes.' :
                        'Has usado más del 80%. Considera reducir gastos.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Días restantes del mes</p>
                  <p className="text-lg font-semibold">
                    {30 - new Date().getDate()} días
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Budgets */}
        <Card>
          <CardHeader>
            <CardTitle>Presupuesto por Categoría</CardTitle>
            <CardDescription>Gestiona el presupuesto de cada categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end mb-4">
              <div className="space-y-2">
                <Label htmlFor="category-report-start-date">Fecha inicio</Label>
                <Input
                  id="category-report-start-date"
                  type="date"
                  value={categoryReportStartDate}
                  onChange={(event) =>
                    setCategoryReportStartDate(event.target.value)
                  }
                  disabled={loadingCategoryReport}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-report-end-date">Fecha fin</Label>
                <Input
                  id="category-report-end-date"
                  type="date"
                  value={categoryReportEndDate}
                  onChange={(event) =>
                    setCategoryReportEndDate(event.target.value)
                  }
                  disabled={loadingCategoryReport}
                />
              </div>

              <Button
                onClick={handleFetchCategoryReport}
                disabled={
                  loadingCategoryReport ||
                  !categoryReportStartDate ||
                  !categoryReportEndDate
                }
              >
                Consultar
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {categoryReportItems.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  {loadingCategoryReport
                    ? "Cargando reporte por categorias..."
                    : categoryReportError ||
                      (hasRequestedCategoryReport
                        ? "No hay datos por categoria"
                        : "Cargando reporte por categorias...")}
                </div>
              ) : categoryReportItems.map((cat, index) => {
                const categoryColor =
                  expenseCategories[index % expenseCategories.length]?.color ||
                  "#999999";
                const percentage = cat.percentage;
                const percentageLabel = percentage
                  .toFixed(1)
                  .replace(".0", "");
                const status = percentage >= 100 ? 'exceeded' : percentage >= 85 ? 'warning' : 'normal';
                const remaining = categoryReportTotal - cat.amount;
                
                return (
                  <div 
                    key={`${cat.categoryName}-${index}`} 
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${categoryColor}20` }}
                        >
                          <Wallet className="h-5 w-5" style={{ color: categoryColor }} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{cat.categoryName}</h4>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(cat.amount, user.currency)} de {formatCurrency(categoryReportTotal, user.currency)}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={status === 'exceeded' ? 'destructive' : status === 'warning' ? 'outline' : 'secondary'}
                        className={status === 'warning' ? 'border-warning text-warning bg-warning/10' : ''}
                      >
                        {percentageLabel}%
                      </Badge>
                    </div>
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className="h-2 mb-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {status === 'exceeded' ? (
                          <span className="text-destructive">Excedido por {formatCurrency(Math.abs(remaining), user.currency)}</span>
                        ) : (
                          `Disponible: ${formatCurrency(remaining, user.currency)}`
                        )}
                      </span>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        Editar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
