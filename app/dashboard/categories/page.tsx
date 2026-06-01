"use client";

import { useEffect, useState, type ElementType } from "react";
import {
  Car,
  Edit2,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  Home,
  PiggyBank,
  Plane,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  TrendingUp,
  Utensils,
  Wallet,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/hooks/useCategory";
import { DashboardHeader } from "@/components/dashboard-header";
import { cn } from "@/lib/utils";
import type { CategoryResponse } from "@/src/services/categoryService";

type User = {
  nombre: string;
  email: string;
  currency: string;
};

type CategoryForm = {
  nombre: string;
  icon: string;
};

const defaultCategoryForm: CategoryForm = {
  nombre: "",
  icon: "Tag",
};

const categoryIcons = [
  { name: "Utensils", label: "Alimentacion", icon: Utensils },
  { name: "Car", label: "Transporte", icon: Car },
  { name: "Home", label: "Vivienda", icon: Home },
  { name: "HeartPulse", label: "Salud", icon: HeartPulse },
  { name: "GraduationCap", label: "Educacion", icon: GraduationCap },
  { name: "Gamepad2", label: "Entretenimiento", icon: Gamepad2 },
  { name: "ShoppingBag", label: "Compras", icon: ShoppingBag },
  { name: "Plane", label: "Viajes", icon: Plane },
  { name: "Wrench", label: "Servicios", icon: Wrench },
  { name: "PiggyBank", label: "Ahorro", icon: PiggyBank },
  { name: "TrendingUp", label: "Inversiones", icon: TrendingUp },
  { name: "Wallet", label: "Salario", icon: Wallet },
  { name: "Tag", label: "General", icon: Tag },
] as const;

const iconMap = categoryIcons.reduce<Record<string, ElementType>>(
  (acc, item) => {
    acc[item.name] = item.icon;
    return acc;
  },
  {}
);

function getCategoryIconName(category?: Pick<CategoryResponse, "icon" | "icono">) {
  return category?.icon || category?.icono || "Tag";
}

function getCategoryIcon(iconName: string) {
  return iconMap[iconName] || Tag;
}

export default function CategoriesPage() {
  const [user, setUser] = useState<User>({
    nombre: "Usuario",
    email: "",
    currency: "COP",
  });

  const { categories, loading, addCategory, editCategory, removeCategory } =
    useCategories();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [categoryForm, setCategoryForm] =
    useState<CategoryForm>(defaultCategoryForm);

  const SelectedIcon = getCategoryIcon(categoryForm.icon);

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

  const resetForm = () => {
    setEditingCategoryId(null);
    setCategoryForm(defaultCategoryForm);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: CategoryResponse) => {
    setEditingCategoryId(category.id);
    setCategoryForm({
      nombre: category.nombre,
      icon: getCategoryIconName(category),
    });
    setIsDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.nombre.trim()) return;

    const payload = {
      nombre: categoryForm.nombre.trim(),
      icon: categoryForm.icon,
    };

    if (editingCategoryId) {
      await editCategory(editingCategoryId, payload);
    } else {
      await addCategory(payload);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteCategory = async (categoryId: number) => {
    await removeCategory(categoryId);
  };

  return (
    <>
      <DashboardHeader
        title="Categorias"
        subtitle={`Gestiona tus categorias de ingresos y gastos, ${user.nombre}`}
      />

      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Tus Categorias</h2>
            <p className="text-sm text-muted-foreground">
              Organiza tus finanzas con categorias personalizadas
            </p>
          </div>

          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Categoria
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategoryId
                  ? "Actualizar Categoria"
                  : "Crear Nueva Categoria"}
              </DialogTitle>

              <DialogDescription>
                {editingCategoryId
                  ? "Modifica la categoria seleccionada."
                  : "Agrega una nueva categoria para organizar tus finanzas."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Categoria</Label>

                <Input
                  id="nombre"
                  value={categoryForm.nombre}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      nombre: e.target.value,
                    })
                  }
                  placeholder="Ej: Casa, Transporte, Comida"
                />
              </div>

              <div className="space-y-3">
                <Label>Icono</Label>

                <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-background border">
                    <SelectedIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Vista previa</p>
                    <p className="text-xs text-muted-foreground">
                      {categoryForm.icon}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {categoryIcons.map((item) => {
                    const Icon = item.icon;
                    const isSelected = categoryForm.icon === item.name;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() =>
                          setCategoryForm({
                            ...categoryForm,
                            icon: item.name,
                          })
                        }
                        className={cn(
                          "rounded-lg border bg-card p-3 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                          "flex flex-col items-center gap-2",
                          isSelected &&
                            "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-medium">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>

              <Button
                onClick={handleSaveCategory}
                disabled={!categoryForm.nombre.trim()}
              >
                {editingCategoryId ? "Actualizar Categoria" : "Crear Categoria"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {loading ? (
          <p className="text-sm text-muted-foreground">
            Cargando categorias...
          </p>
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Todavia no tienes categorias creadas.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const iconName = getCategoryIconName(category);
              const CategoryIcon = getCategoryIcon(iconName);

              console.log("Icono guardado:", category.icon);
              console.log("Icono encontrado:", iconMap[iconName]);

              return (
                <Card
                  key={category.id}
                  className="group hover:shadow-md transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted"
                          style={
                            category.color
                              ? { backgroundColor: `${category.color}20` }
                              : undefined
                          }
                        >
                          <CategoryIcon
                            className="h-6 w-6 text-muted-foreground"
                            style={
                              category.color
                                ? { color: category.color }
                                : undefined
                            }
                          />
                        </div>

                        <div>
                          <h3 className="font-semibold">{category.nombre}</h3>
                          {category.descripcion && (
                            <p className="text-sm text-muted-foreground">
                              {category.descripcion}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              Categoria
                            </Badge>
                            {category.color && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span
                                  className="h-3 w-3 rounded-full border"
                                  style={{ backgroundColor: category.color }}
                                />
                                Color
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
