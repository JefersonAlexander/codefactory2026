import { useEffect, useState } from "react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  CategoryRequest,
  CategoryResponse,
} from "@/src/services/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCategories() {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) return;

      const data = await getCategories(token);

      setCategories(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addCategory(data: CategoryRequest) {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const newCategory = await createCategory(data, token);

      setCategories((prev) => [...prev, newCategory]);

      return newCategory;
    } catch (error) {
      console.error("Error creando categoría:", error);
    }
  }

  async function editCategory(categoryId: number, data: CategoryRequest) {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const updatedCategory = await updateCategory(categoryId, data, token);

      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId
            ? { ...category, ...updatedCategory }
            : category
        )
      );

      return updatedCategory;
    } catch (error) {
      console.error("Error actualizando categoría:", error);
    }
  }

  async function removeCategory(categoryId: number) {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      await deleteCategory(categoryId, token);

      setCategories((prev) =>
        prev.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      console.error("Error eliminando categoría:", error);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    setCategories,
    loading,
    loadCategories,
    addCategory,
    editCategory,
    removeCategory,
  };
}
