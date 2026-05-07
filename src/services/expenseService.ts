// src/services/expenseService.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export interface ExpenseRequest {
  valor: number;
  fecha: string;
  descripcion: string; 
  idUsuario: number;
  idCategoria: number;
}

export interface ExpenseResponse {
  id: number;
  valor: number;
  fecha: string;
  descripcion: string;
  idUsuario: number;
  idCategoria: number;
}

export async function getExpenses(token: string): Promise<ExpenseResponse[]> {
  const response = await fetch(`${API_URL}/api/gastos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error obteniendo gastos");
  }

  return response.json();
}

export async function getExpenseById(
  id: number,
  token: string
): Promise<ExpenseResponse> {
  const response = await fetch(`${API_URL}/api/gastos/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error obteniendo gasto");
  }

  return response.json();
}

export async function getExpensesByUser(
  idUsuario: number,
  token: string
): Promise<ExpenseResponse[]> {
  const response = await fetch(`${API_URL}/api/gastos/usuario/${idUsuario}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error obteniendo gastos del usuario");
  }

  return response.json();
}

export async function getExpensesByCategory(
  idCategoria: number,
  token: string
): Promise<ExpenseResponse[]> {
  const response = await fetch(`${API_URL}/api/gastos/categoria/${idCategoria}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error obteniendo gastos por categoría");
  }

  return response.json();
}

export async function createExpense(
  data: ExpenseRequest,
  token: string
): Promise<ExpenseResponse> {
  const response = await fetch(`${API_URL}/api/gastos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error creando gasto");
  }

  return response.json();
}

export async function updateExpense(
  id: number,
  data: ExpenseRequest,
  token: string
): Promise<ExpenseResponse> {
  const response = await fetch(`${API_URL}/api/gastos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error actualizando gasto");
  }

  return response.json();
}

export async function deleteExpense(
  id: number,
  token: string
): Promise<void> {
  const response = await fetch(`${API_URL}/api/gastos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error eliminando gasto");
  }
}