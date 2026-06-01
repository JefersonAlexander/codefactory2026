"use client";

import { useEffect, useMemo, useState } from "react";
import {TrendingUp,TrendingDown,Wallet,PiggyBank,ArrowUpRight,ArrowDownRight,Utensils,Car,Home,Gamepad2,HeartPulse,GraduationCap,ShoppingBag,Tag,} from "lucide-react";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardHeader } from "@/components/dashboard-header";
import {formatCurrency,getMonthName,currentBudget} from "@/lib/mock-data";
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,Legend,AreaChart,Area,} from "recharts";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { useBudget } from "@/hooks/useBudget";
import { useCategoryReport } from "@/hooks/useCategoryReport";
import { 
  Flame, 
  ArrowRight, 
  Shield, 
  Zap,
  BarChart3,
  Target,
  CheckCircle2
} from "lucide-react";

type User = {
  nombre: string;
  email: string;
  currency: string;
};


const features = [
  {
    icon: Wallet,
    title: "Control de Presupuesto",
    description: "Define y gestiona tu presupuesto mensual con categorías personalizadas.",
  },
  {
    icon: BarChart3,
    title: "Reportes Visuales",
    description: "Visualiza tus finanzas con gráficas claras y reportes detallados.",
  },
  {
    icon: TrendingUp,
    title: "Seguimiento de Ingresos",
    description: "Registra todos tus ingresos y observa tu progreso financiero.",
  },
  {
    icon: Target,
    title: "Metas de Ahorro",
    description: "Establece y alcanza tus objetivos financieros paso a paso.",
  },
];

const categoryConfig = {
  "Alimentacion": { icon: Utensils, color: "#e67e22" },
  "Alimentación": { icon: Utensils, color: "#e67e22" },
  Transporte: { icon: Car, color: "#3498db" },
  Vivienda: { icon: Home, color: "#9b59b6" },
  Entretenimiento: { icon: Gamepad2, color: "#e74c3c" },
  Salud: { icon: HeartPulse, color: "#1abc9c" },
  Educacion: { icon: GraduationCap, color: "#f39c12" },
  Educación: { icon: GraduationCap, color: "#f39c12" },
  Compras: { icon: ShoppingBag, color: "#95a5a6" },
} as const;

const fallbackCategoryConfig = {
  icon: Tag,
  color: "#e67e22",
};

function getDashboardDateRange(month: number, year: number) {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().split("T")[0];

  return { startDate, endDate };
}

const monthlyTrendData = [
  { month: "Ene", ingresos: 25000, gastos: 27000 },
  { month: "Feb", ingresos: 26000, gastos: 24500 },
  { month: "Mar", ingresos: 28500, gastos: 22100 },
  { month: "Abr", ingresos: 0, gastos: 0 },
];

export default function DashboardPage() {
  const [user, setUser] = useState<User>({
    nombre: "Usuario",
    email: "",
    currency: "COP",
  });

  const {incomes, expenses,totalIncome,totalExpenses,loading,} = useFinancialSummary();
  const {presupuesto,indexActual,editBudget,setEditBudget,loading:loadingBudget} = useBudget();
  const {
    report: categoryReport,
    loading: loadingCategoryReport,
    error: categoryReportError,
    fetchReport,
  } = useCategoryReport();

  const totalSpent = totalExpenses;

  const totalBudget = presupuesto ? presupuesto.valor : 0;
  const budgetPercentage = Math.round((totalSpent / totalBudget) * 100);
  const remaining = totalBudget - totalSpent;



const balance = totalIncome - totalExpenses;
const dashboardDateRange = useMemo(
  () => getDashboardDateRange(currentBudget.month, currentBudget.year),
  []
);

const categoryExpenses = categoryReport?.categoryExpenses ?? [];

const pieChartData = useMemo(
  () =>
    categoryExpenses.map((item) => {
      const config =
        categoryConfig[item.categoryName as keyof typeof categoryConfig] ||
        fallbackCategoryConfig;

      return {
        name: item.categoryName,
        value: item.amount,
        percentage: item.percentage,
        color: config.color,
      };
    }),
  [categoryExpenses]
);

const categorySpendingData = useMemo(
  () =>
    categoryExpenses.map((item) => {
      const config =
        categoryConfig[item.categoryName as keyof typeof categoryConfig] ||
        fallbackCategoryConfig;

      return {
        name: item.categoryName,
        amount: item.amount,
        percentage: item.percentage,
        fill: config.color,
      };
    }),
  [categoryExpenses]
);


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

  useEffect(() => {
    fetchReport(dashboardDateRange.startDate, dashboardDateRange.endDate);
  }, [dashboardDateRange.endDate, dashboardDateRange.startDate, fetchReport]);

  useEffect(() => {
    console.log("Reporte recibido:", categoryReport);
    console.log("Category Expenses:", categoryReport?.categoryExpenses);
  }, [categoryReport]);

  const firstName = user.nombre.split(" ")[0];

  const warningCategories = currentBudget.categories.filter((cat) => {
    const percentage = (cat.spent / cat.allocated) * 100;
    return percentage >= 85 && percentage < 100;
  });

  const exceededCategories = currentBudget.categories.filter((cat) => {
    return cat.spent >= cat.allocated;
  });

  return (
    <>
      <DashboardHeader
        title={`Hola, ${firstName}`}
        subtitle={`${getMonthName(currentBudget.month)} ${currentBudget.year}`}
      />

      <main className="flex-1 p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Presupuesto Total
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalBudget, user.currency)}
              </div>

              <div className="mt-2">
                <Progress value={budgetPercentage} className="h-2" />
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                {budgetPercentage}% usado -{" "}
                {formatCurrency(remaining, user.currency)} disponible
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ingresos del Mes
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
                Gastos del Mes
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(totalSpent, user.currency)}
              </div>

              <div className="flex items-center gap-1 mt-2">
                <ArrowDownRight className="h-3 w-3 text-success" />
                
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Balance
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-primary" />
            </CardHeader>

            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  balance >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {formatCurrency(balance, user.currency)}
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                {balance >= 0 ? "Vas bien con tu ahorro" : "Revisa tus gastos"}
              </p>
            </CardContent>
          </Card>
        </div>

        

        <section id="features" className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      Todo lo que necesitas para tus finanzas
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Herramientas poderosas y fáciles de usar para gestionar tu dinero de manera efectiva.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                      <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
                        <CardContent className="p-6">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <feature.icon className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
      </main>
    </>
  );
}
