"use client";

import Link from "next/link";
import { 
  Flame, 
  ArrowRight, 
  PieChart, 
  TrendingUp, 
  Shield, 
  Zap,
  BarChart3,
  Wallet,
  Target,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

const benefits = [
  "Visualiza a dónde va tu dinero cada mes",
  "Recibe alertas cuando te acerques a tus límites",
  "Compara tu gasto real vs planificado",
  "Toma decisiones financieras más inteligentes",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FinZen</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Características
            </Link>
            <Link href="#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Beneficios
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/login">
                Comenzar Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Zap className="h-4 w-4" />
              Gestión financiera simple y efectiva
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance">
              Toma el control de tus{" "}
              <span className="text-primary">finanzas personales</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              FinZen te ayuda a organizar tus ingresos, gastos y presupuestos de manera visual e intuitiva. 
              Entiende tu situación financiera y alcanza tus metas de ahorro.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="min-w-[200px]">
                <Link href="/login">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="min-w-[200px]">
                <Link href="/dashboard">
                  Ver Demo
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 border shadow-2xl overflow-hidden">
              <div className="absolute inset-4 rounded-xl bg-card border shadow-lg overflow-hidden">
                <div className="h-12 border-b bg-muted/50 flex items-center gap-2 px-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-warning/60" />
                    <div className="w-3 h-3 rounded-full bg-success/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="h-6 w-48 rounded bg-muted" />
                  </div>
                </div>
                <div className="p-6 grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border p-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 mb-2" />
                          <div className="h-3 w-16 rounded bg-muted" />
                        </div>
                      ))}
                    </div>
                    <div className="h-48 rounded-lg bg-muted/50 border p-4">
                      <div className="h-full flex items-end gap-2">
                        {[40, 65, 45, 80, 55, 70, 85, 60, 75, 50, 90, 65].map((h, i) => (
                          <div 
                            key={i} 
                            className="flex-1 rounded-t bg-gradient-to-t from-primary to-primary/60"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-32 rounded-lg bg-muted/50 border p-3">
                      <div className="w-full h-full rounded-full border-8 border-primary/30 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary/20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 rounded bg-muted/50 border" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Entiende tu dinero como nunca antes
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                FinZen te brinda una visión clara de tus finanzas con herramientas visuales 
                que hacen fácil entender y mejorar tu situación financiera.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8" size="lg" asChild>
                <Link href="/login">
                  Empieza Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 p-8">
                <div className="h-full rounded-xl bg-card border shadow-lg p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Balance del Mes</p>
                      <p className="text-3xl font-bold text-primary">$6,400</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-success" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Presupuesto Usado</span>
                        <span className="text-sm font-medium">72%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[72%] rounded-full bg-primary" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                        <p className="text-xs text-muted-foreground">Ingresos</p>
                        <p className="text-lg font-semibold text-success">$28,500</p>
                      </div>
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <p className="text-xs text-muted-foreground">Gastos</p>
                        <p className="text-lg font-semibold text-destructive">$22,100</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {['Alimentación', 'Transporte', 'Entretenimiento'].map((cat, i) => (
                        <div key={cat} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary" style={{ opacity: 1 - i * 0.25 }} />
                          <span className="text-sm flex-1">{cat}</span>
                          <span className="text-sm text-muted-foreground">{[36, 25, 15][i]}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comienza a mejorar tus finanzas hoy
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Únete a miles de personas que ya están tomando control de su dinero con FinZen.
            </p>
            <Button size="lg" asChild>
              <Link href="/login">
                Crear Cuenta Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Flame className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">FinZen</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2026 FinZen. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
