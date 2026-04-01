"use client";

import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Download
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard-header";
import { 
  monthlyReports, 
  currentBudget,
  formatCurrency,
  getCategoryById,
  getMonthName,
  mockUser 
} from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  ComposedChart,
  Area
} from "recharts";

const COLORS = ['#e67e22', '#3498db', '#9b59b6', '#e74c3c', '#1abc9c', '#f39c12', '#27ae60', '#95a5a6'];

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const report = monthlyReports[selectedMonth];
  
  const handlePrevMonth = () => {
    if (selectedMonth < monthlyReports.length - 1) {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth > 0) {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  // Comparison data for bar chart
  const comparisonData = [
    { name: 'Ingresos', planificado: currentBudget.totalBudget, real: report.totalIncome },
    { name: 'Gastos', planificado: currentBudget.totalBudget * 0.85, real: report.totalExpenses },
  ];

  // Monthly trend data
  const trendData = monthlyReports.slice().reverse().map((r) => ({
    month: getMonthName(r.month).substring(0, 3),
    ingresos: r.totalIncome,
    gastos: r.totalExpenses,
    balance: r.balance,
  }));

  // Category breakdown for pie chart
  const categoryData = report.categoryBreakdown.map((cat, index) => ({
    name: getCategoryById(cat.categoryId)?.name || cat.categoryId,
    value: cat.amount,
    percentage: cat.percentage,
    color: getCategoryById(cat.categoryId)?.color || COLORS[index % COLORS.length],
  }));

  const statusConfig = {
    saving: {
      icon: CheckCircle2,
      label: 'Ahorrando',
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/20',
      message: '¡Excelente! Estás ahorrando dinero este mes.',
    },
    balanced: {
      icon: Target,
      label: 'Equilibrado',
      color: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/20',
      message: 'Tu balance está equilibrado. Intenta ahorrar un poco más.',
    },
    overspending: {
      icon: AlertTriangle,
      label: 'Sobregasto',
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      border: 'border-destructive/20',
      message: 'Atención: estás gastando más de lo que ingresas.',
    },
  };

  const status = statusConfig[report.status];
  const StatusIcon = status.icon;

  return (
    <>
      <DashboardHeader 
        title="Reportes Mensuales" 
        subtitle="Analiza tu situación financiera"
      />
      
      <main className="flex-1 p-6 space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrevMonth}
              disabled={selectedMonth >= monthlyReports.length - 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold">
              {getMonthName(report.month)} {report.year}
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNextMonth}
              disabled={selectedMonth === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>

        {/* Summary Status */}
        <Card className={`${status.bg} ${status.border} border`}>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl ${status.bg} flex items-center justify-center`}>
                <StatusIcon className={`h-8 w-8 ${status.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-xl font-bold ${status.color}`}>Estado: {status.label}</h3>
                  <Badge className={`${status.bg} ${status.color} border ${status.border}`}>
                    {report.status === 'saving' ? '+' : ''}{formatCurrency(report.balance, mockUser.currency)}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{status.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Ingresos
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(report.totalIncome, mockUser.currency)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {getMonthName(report.month)} {report.year}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Gastos
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(report.totalExpenses, mockUser.currency)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round((report.totalExpenses / report.totalIncome) * 100)}% de ingresos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Balance Final
              </CardTitle>
              <PiggyBank className={`h-4 w-4 ${report.balance >= 0 ? 'text-success' : 'text-destructive'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${report.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(report.balance, mockUser.currency)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {report.balance >= 0 ? 'Ahorro del mes' : 'Déficit del mes'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Income vs Expenses Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Planificado vs Real</CardTitle>
                  <CardDescription>Comparación de tu presupuesto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis tickFormatter={(value) => `$${value/1000}k`} className="text-xs" />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value, mockUser.currency)}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="planificado" fill="hsl(var(--muted))" name="Planificado" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="real" fill="hsl(var(--primary))" name="Real" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumen Financiero</CardTitle>
                  <CardDescription>Análisis detallado del mes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tasa de Ahorro</span>
                      <span className={`font-semibold ${report.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {report.totalIncome > 0 ? Math.round((report.balance / report.totalIncome) * 100) : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={report.totalIncome > 0 ? Math.max(0, Math.round((report.balance / report.totalIncome) * 100)) : 0} 
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Gasto Diario Promedio</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(report.totalExpenses / 30, mockUser.currency)}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Ingreso Diario Promedio</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(report.totalIncome / 30, mockUser.currency)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Top 3 Categorías de Gasto</h4>
                    {report.categoryBreakdown.slice(0, 3).map((cat, index) => {
                      const category = getCategoryById(cat.categoryId);
                      return (
                        <div key={cat.categoryId} className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-primary-foreground"
                            style={{ backgroundColor: category?.color }}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{category?.name}</p>
                            <p className="text-xs text-muted-foreground">{cat.percentage}% del total</p>
                          </div>
                          <span className="font-semibold">
                            {formatCurrency(cat.amount, mockUser.currency)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Gastos</CardTitle>
                  <CardDescription>Por categoría</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value, mockUser.currency)}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend 
                          layout="vertical" 
                          align="right" 
                          verticalAlign="middle"
                          formatter={(value) => <span className="text-sm">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Category Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalle por Categoría</CardTitle>
                  <CardDescription>Desglose completo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                    {report.categoryBreakdown.map((cat) => {
                      const category = getCategoryById(cat.categoryId);
                      return (
                        <div 
                          key={cat.categoryId}
                          className="flex items-center gap-4 p-3 rounded-lg border bg-card"
                        >
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${category?.color}20` }}
                          >
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: category?.color }}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{category?.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={cat.percentage} className="h-1.5 flex-1" />
                              <span className="text-xs text-muted-foreground w-12">
                                {cat.percentage}%
                              </span>
                            </div>
                          </div>
                          <span className="font-semibold">
                            {formatCurrency(cat.amount, mockUser.currency)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de los Últimos Meses</CardTitle>
                <CardDescription>Evolución de ingresos, gastos y balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis tickFormatter={(value) => `$${value/1000}k`} className="text-xs" />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value, mockUser.currency)}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="balance" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.2}
                        stroke="hsl(var(--primary))"
                        name="Balance"
                      />
                      <Bar dataKey="ingresos" fill="#27ae60" name="Ingresos" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="gastos" fill="#e74c3c" name="Gastos" radius={[4, 4, 0, 0]} />
                      <Line 
                        type="monotone" 
                        dataKey="balance" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                        name="Balance"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Historical Summary */}
            <div className="grid gap-4 md:grid-cols-3">
              {monthlyReports.map((r, index) => {
                const rStatus = statusConfig[r.status];
                const RStatusIcon = rStatus.icon;
                
                return (
                  <Card 
                    key={`${r.month}-${r.year}`} 
                    className={`cursor-pointer transition-shadow hover:shadow-md ${
                      selectedMonth === index ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedMonth(index)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-semibold">{getMonthName(r.month)}</p>
                          <p className="text-xs text-muted-foreground">{r.year}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-full ${rStatus.bg} flex items-center justify-center`}>
                          <RStatusIcon className={`h-5 w-5 ${rStatus.color}`} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Ingresos</span>
                          <span className="text-success font-medium">
                            {formatCurrency(r.totalIncome, mockUser.currency)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Gastos</span>
                          <span className="text-destructive font-medium">
                            {formatCurrency(r.totalExpenses, mockUser.currency)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t">
                          <span className="font-medium">Balance</span>
                          <span className={`font-bold ${r.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {formatCurrency(r.balance, mockUser.currency)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
