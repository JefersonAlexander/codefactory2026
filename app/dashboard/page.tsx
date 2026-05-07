"use client";

import { useEffect, useState } from "react";
import {TrendingUp,TrendingDown,Wallet,PiggyBank,ArrowUpRight,ArrowDownRight,AlertTriangle,} from "lucide-react";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/dashboard-header";
import {recentTransactions,formatCurrency,getCategoryById,getMonthName,currentBudget} from "@/lib/mock-data";
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,Legend,AreaChart,Area,} from "recharts";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { useBudget } from "@/hooks/useBudget";

type User = {
  nombre: string;
  email: string;
  currency: string;
};


const categorySpendingData = currentBudget.categories.map((cat) => {
  const category = getCategoryById(cat.categoryId);

  return {
    name: category?.name || cat.categoryId,
    allocated: cat.allocated,
    spent: cat.spent,
    fill: category?.color || "#e67e22",
  };
});

const pieChartData = currentBudget.categories.map((cat) => {
  const category = getCategoryById(cat.categoryId);

  return {
    name: category?.name || cat.categoryId,
    value: cat.spent,
    color: category?.color || "#e67e22",
  };
});

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
  const {presupuesto,historial,indexActual,editBudget,setEditBudget,loading:loadingBudget} = useBudget();

  const totalSpent = totalExpenses;

  const totalBudget = presupuesto ? presupuesto.valor : 0;
  const budgetPercentage = Math.round((totalSpent / totalBudget) * 100);
  const remaining = totalBudget - totalSpent;



const balance = totalIncome - totalExpenses;


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
                <span className="text-xs text-success">
                  -8% vs mes anterior
                </span>
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

        {(warningCategories.length > 0 || exceededCategories.length > 0) && (
          <div className="space-y-2">
            {exceededCategories.map((cat) => {
              const category = getCategoryById(cat.categoryId);

              return (
                <div
                  key={cat.categoryId}
                  className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                >
                  <AlertTriangle className="h-5 w-5 text-destructive" />

                  <span className="text-sm font-medium">
                    Has excedido el presupuesto de {category?.name} por{" "}
                    {formatCurrency(cat.spent - cat.allocated, user.currency)}
                  </span>
                </div>
              );
            })}

            {warningCategories.map((cat) => {
              const category = getCategoryById(cat.categoryId);
              const percentage = Math.round((cat.spent / cat.allocated) * 100);

              return (
                <div
                  key={cat.categoryId}
                  className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20"
                >
                  <AlertTriangle className="h-5 w-5 text-warning" />

                  <span className="text-sm font-medium">
                    {category?.name} está al {percentage}% del presupuesto
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ingresos vs Gastos</CardTitle>
              <CardDescription>
                Tendencia de los últimos meses
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrendData}>
                    <defs>
                      <linearGradient
                        id="colorIngresos"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#27ae60"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#27ae60"
                          stopOpacity={0}
                        />
                      </linearGradient>

                      <linearGradient
                        id="colorGastos"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#e74c3c"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#e74c3c"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />

                    <XAxis dataKey="month" className="text-xs" />

                    <YAxis
                      className="text-xs"
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />

                    <Tooltip
                      formatter={(value: number) =>
                        formatCurrency(value, user.currency)
                      }
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="ingresos"
                      stroke="#27ae60"
                      fillOpacity={1}
                      fill="url(#colorIngresos)"
                      name="Ingresos"
                    />

                    <Area
                      type="monotone"
                      dataKey="gastos"
                      stroke="#e74c3c"
                      fillOpacity={1}
                      fill="url(#colorGastos)"
                      name="Gastos"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución de Gastos</CardTitle>
              <CardDescription>Por categoría este mes</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value: number) =>
                        formatCurrency(value, user.currency)
                      }
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />

                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      formatter={(value) => (
                        <span className="text-sm text-foreground">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Presupuesto por Categoría</CardTitle>
            <CardDescription>
              Comparación entre asignado y gastado
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySpendingData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    tickFormatter={(value) => `$${value / 1000}k`}
                    className="text-xs"
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    className="text-xs"
                    width={100}
                  />

                  <Tooltip
                    formatter={(value: number) =>
                      formatCurrency(value, user.currency)
                    }
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />

                  <Bar
                    dataKey="allocated"
                    fill="hsl(var(--muted))"
                    name="Asignado"
                    radius={[0, 4, 4, 0]}
                  />

                  <Bar
                    dataKey="spent"
                    fill="hsl(var(--primary))"
                    name="Gastado"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Transacciones Recientes</CardTitle>
              <CardDescription>Últimos movimientos</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {recentTransactions.slice(0, 6).map((transaction) => {
                  const category = getCategoryById(transaction.categoryId);

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: `${category?.color || "#999999"}20`,
                        }}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp
                            className="h-5 w-5"
                            style={{ color: category?.color || "#999999" }}
                          />
                        ) : (
                          <TrendingDown
                            className="h-5 w-5"
                            style={{ color: category?.color || "#999999" }}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {category?.name || "Sin categoría"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold ${
                            transaction.type === "income"
                              ? "text-success"
                              : "text-foreground"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount, user.currency)}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString(
                            "es-MX",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progreso por Categoría</CardTitle>
              <CardDescription>
                Estado de cada presupuesto
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {currentBudget.categories.map((cat) => {
                  const category = getCategoryById(cat.categoryId);
                  const percentage = Math.round(
                    (cat.spent / cat.allocated) * 100
                  );

                  const status =
                    percentage >= 100
                      ? "exceeded"
                      : percentage >= 85
                      ? "warning"
                      : "normal";

                  return (
                    <div key={cat.categoryId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: category?.color || "#999999",
                            }}
                          />

                          <span className="text-sm font-medium">
                            {category?.name || "Sin categoría"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {formatCurrency(cat.spent, user.currency)} /{" "}
                            {formatCurrency(cat.allocated, user.currency)}
                          </span>

                          {status === "exceeded" && (
                            <Badge variant="destructive" className="text-xs">
                              Excedido
                            </Badge>
                          )}

                          {status === "warning" && (
                            <Badge className="bg-warning/20 text-warning border-warning/30 text-xs">
                              Alerta
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Progress
                        value={Math.min(percentage, 100)}
                        className="h-2"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}