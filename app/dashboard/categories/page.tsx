"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, MoreHorizontal } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DashboardHeader } from "@/components/dashboard-header";
import { useCategories } from "@/hooks/useCategory";

type User = {
  nombre: string;
  email: string;
  currency: string;
};

export default function CategoriesPage() {
  const [user, setUser] = useState<User>({
    nombre: "Usuario",
    email: "",
    currency: "COP",
  });

  const {
    categories,
    loading,
    addCategory,
    editCategory,
    removeCategory,
  } = useCategories();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );

  const [categoryForm, setCategoryForm] = useState({
    nombre: "",
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

  const openCreateDialog = () => {
    setEditingCategoryId(null);
    setCategoryForm({ nombre: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: { id: number; nombre: string }) => {
    setEditingCategoryId(category.id);
    setCategoryForm({ nombre: category.nombre });
    setIsDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.nombre.trim()) return;

    if (editingCategoryId) {
      await editCategory(editingCategoryId, {
        nombre: categoryForm.nombre.trim(),
      });
    } else {
      await addCategory({
        nombre: categoryForm.nombre.trim(),
      });
    }

    setIsDialogOpen(false);
    setEditingCategoryId(null);
    setCategoryForm({ nombre: "" });
  };

  const handleDeleteCategory = async (categoryId: number) => {
    await removeCategory(categoryId);
  };

  return (
    <>
      <DashboardHeader
        title="Categorías"
        subtitle={`Gestiona tus categorías de ingresos y gastos, ${user.nombre}`}
      />

      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Tus Categorías</h2>
            <p className="text-sm text-muted-foreground">
              Organiza tus finanzas con categorías personalizadas
            </p>
          </div>

          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Categoría
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategoryId
                  ? "Actualizar Categoría"
                  : "Crear Nueva Categoría"}
              </DialogTitle>

              <DialogDescription>
                {editingCategoryId
                  ? "Modifica el nombre de la categoría seleccionada."
                  : "Agrega una nueva categoría para organizar tus finanzas."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Categoría</Label>

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
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingCategoryId(null);
                  setCategoryForm({ nombre: "" });
                }}
              >
                Cancelar
              </Button>

              <Button
                onClick={handleSaveCategory}
                disabled={!categoryForm.nombre.trim()}
              >
                {editingCategoryId ? "Actualizar Categoría" : "Crear Categoría"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {loading ? (
          <p className="text-sm text-muted-foreground">
            Cargando categorías...
          </p>
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Todavía no tienes categorías creadas.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="group hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted">
                        <MoreHorizontal className="h-6 w-6 text-muted-foreground" />
                      </div>

                      <div>
                        <h3 className="font-semibold">{category.nombre}</h3>
                        <Badge variant="secondary" className="text-xs">
                          Categoría
                        </Badge>
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
            ))}
          </div>
        )}
      </main>
    </>
  );
}