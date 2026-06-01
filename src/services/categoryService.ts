// src/services/categoryService.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export interface CategoryRequest {
  nombre: string;
  icon: string;
}

export interface CategoryResponse {
  id: number;
  nombre: string;
  icon?: string;
  icono?: string;
  name?: string;
  descripcion?: string;
  color?: string;
}

type CategoryApiResponse = CategoryResponse & {
  name?: string;
  icon?: string;
  icono?: string;
};

function buildCategoryPayload(data: CategoryRequest) {
  return {
    nombre: data.nombre,
    name: data.nombre,
    icon: data.icon,
  };
}

function normalizeCategory(
  category: CategoryApiResponse,
  fallback?: CategoryRequest
): CategoryResponse {
  return {
    ...category,
    nombre: category.nombre || category.name || fallback?.nombre || "",
    icon: category.icon || category.icono || fallback?.icon || "Tag",
  };
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

  const data = (await response.json()) as CategoryApiResponse[];

  return data.map((category) => normalizeCategory(category));
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

  const data = (await response.json()) as CategoryApiResponse;

  return normalizeCategory(data);
}

export async function createCategory(
  data: CategoryRequest,
  token: string
): Promise<CategoryResponse> {
  const payload = buildCategoryPayload(data);

  console.log("Payload enviado:", payload);

  const response = await fetch(`${API_URL}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Error creando la categoría");
  }

  const category = normalizeCategory(
    (await response.json()) as CategoryApiResponse,
    data
  );

  console.log("Categoria actualizada:", category);
  console.log("Icono recibido:", category.icon);

  return category;
}

export async function updateCategory(
  categoryId: number,
  data: CategoryRequest,
  token: string
): Promise<CategoryResponse> {
  const payload = buildCategoryPayload(data);

  console.log("Payload enviado:", payload);

  const response = await fetch(`${API_URL}/api/categories/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Error actualizando la categoría");
  }

  const category = normalizeCategory(
    (await response.json()) as CategoryApiResponse,
    data
  );

  console.log("Categoria actualizada:", category);
  console.log("Icono recibido:", category.icon);

  return category;
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
