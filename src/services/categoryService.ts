// src/services/categoryService.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export interface CategoryRequest {
  nombre: string;
}

export interface CategoryResponse {
  id: number;
  nombre: string;
}

export async function getCategories(token: string): Promise<CategoryResponse[]> {
  const response = await fetch(`${API_URL}/api/categories`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error obteniendo las categorías");
  }

  return response.json();
}

export async function getCategoryById(
  categoryId: number,
  token: string
): Promise<CategoryResponse> {
  const response = await fetch(`${API_URL}/api/categories/${categoryId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error obteniendo la categoría");
  }

  return response.json();
}

export async function createCategory(
  data: CategoryRequest,
  token: string
): Promise<CategoryResponse> {
  const response = await fetch(`${API_URL}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error creando la categoría");
  }

  return response.json();
}

export async function updateCategory(
  categoryId: number,
  data: CategoryRequest,
  token: string
): Promise<CategoryResponse> {
  const response = await fetch(`${API_URL}/api/categories/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error actualizando la categoría");
  }

  return response.json();
}

export async function deleteCategory(
  categoryId: number,
  token: string
): Promise<void> {
  const response = await fetch(`${API_URL}/api/categories/${categoryId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error eliminando la categoría");
  }
}