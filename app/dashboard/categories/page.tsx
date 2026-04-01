"use client";

import { useState } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Utensils, 
  Car, 
  Home, 
  Gamepad2, 
  HeartPulse, 
  GraduationCap, 
  PiggyBank, 
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  PlusCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardHeader } from "@/components/dashboard-header";
import { 
  expenseCategories, 
  incomeCategories, 
  currentBudget, 
  formatCurrency,
  mockUser 
} from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
  'utensils': Utensils,
  'car': Car,
  'home': Home,
  'gamepad': Gamepad2,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'piggy-bank': PiggyBank,
  'ellipsis': MoreHorizontal,
  'briefcase': Briefcase,
  'laptop': Laptop,
  'trending-up': TrendingUp,
  'gift': Gift,
  'plus-circle': PlusCircle,
};

const colorOptions = [
  '#e67e22', '#3498db', '#9b59b6', '#e74c3c', '#1abc9c', 
  '#f39c12', '#27ae60', '#95a5a6', '#2c3e50', '#d35400'
];

export default function CategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'expense' as 'expense' | 'income',
    color: '#e67e22',
    icon: 'utensils'
  });

  const handleCreateCategory = () => {
    // Here you would save to backend
    setIsDialogOpen(false);
    setNewCategory({ name: '', type: 'expense', color: '#e67e22', icon: 'utensils' });
  };

  return (
    <>
      <DashboardHeader 
        title="Categorías" 
        subtitle="Gestiona tus categorías de ingresos y gastos"
      />
      
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Tus Categorías</h2>
            <p className="text-sm text-muted-foreground">
              Organiza tus finanzas con categorías personalizadas
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Categoría</DialogTitle>
                <DialogDescription>
                  Agrega una nueva categoría para organizar tus finanzas
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Categoría</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Ej: Suscripciones"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select 
                    value={newCategory.type} 
                    onValueChange={(value: 'expense' | 'income') => setNewCategory({ ...newCategory, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Gasto</SelectItem>
                      <SelectItem value="income">Ingreso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          newCategory.color === color ? 'scale-110 border-foreground' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewCategory({ ...newCategory, color })}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateCategory} disabled={!newCategory.name}>
                  Crear Categoría
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="expenses" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="expenses">Gastos</TabsTrigger>
            <TabsTrigger value="income">Ingresos</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {expenseCategories.map((category) => {
                const budgetData = currentBudget.categories.find(c => c.categoryId === category.id);
                const spent = budgetData?.spent || 0;
                const allocated = budgetData?.allocated || 0;
                const percentage = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
                const IconComponent = iconMap[category.icon] || MoreHorizontal;
                
                return (
                  <Card key={category.id} className="group hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            <IconComponent className="h-6 w-6" style={{ color: category.color }} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{category.name}</h3>
                            <Badge variant="secondary" className="text-xs">Gasto</Badge>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {allocated > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Presupuesto</span>
                            <span className="font-medium">{formatCurrency(allocated, mockUser.currency)}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Gastado: {formatCurrency(spent, mockUser.currency)}</span>
                            <span>{percentage}%</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {incomeCategories.map((category) => {
                const IconComponent = iconMap[category.icon] || MoreHorizontal;
                
                return (
                  <Card key={category.id} className="group hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            <IconComponent className="h-6 w-6" style={{ color: category.color }} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{category.name}</h3>
                            <Badge className="text-xs bg-success/20 text-success border-success/30">
                              Ingreso
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Categoría de ingresos activa
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Category Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Categorías</CardTitle>
            <CardDescription>Vista general de tus categorías activas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm text-muted-foreground">Total Categorías</p>
                <p className="text-2xl font-bold text-primary">
                  {expenseCategories.length + incomeCategories.length}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/10">
                <p className="text-sm text-muted-foreground">Categorías de Gasto</p>
                <p className="text-2xl font-bold text-destructive">{expenseCategories.length}</p>
              </div>
              <div className="p-4 rounded-lg bg-success/5 border border-success/10">
                <p className="text-sm text-muted-foreground">Categorías de Ingreso</p>
                <p className="text-2xl font-bold text-success">{incomeCategories.length}</p>
              </div>
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
                <p className="text-sm text-muted-foreground">Con Presupuesto</p>
                <p className="text-2xl font-bold text-accent">{currentBudget.categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
