// src/services/incomeService.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export interface IncomeRequest {
  valor: number;
  fecha: string;
  descripcion: string;
  idUsuario: number;
  idCategoria: number;
}

export interface IncomeResponse {
  id: number;
  valor: number;
  fecha: string;
  descripcion: string;
  idUsuario: number;
  idCategoria: number;
}

export async function getIncomes(token: string): Promise<IncomeResponse[]> {
  const response = await fetch(`${API_URL}/api/ingresos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error obteniendo ingresos");
  }

  return response.json();
}

export async function getIncomeById(
  id: number,
  token: string
): Promise<IncomeResponse> {
  const response = await fetch(`${API_URL}/api/ingresos/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error obteniendo ingreso");
  }

  return response.json();
}

export async function getIncomesByUser(
  idUsuario: number,
  token: string
): Promise<IncomeResponse[]> {
  const response = await fetch(`${API_URL}/api/ingresos/usuario/${idUsuario}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error obteniendo ingresos del usuario");
  }

  return response.json();
}

export async function createIncome(
  data: IncomeRequest,
  token: string
): Promise<IncomeResponse> {
  const response = await fetch(`${API_URL}/api/ingresos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error creando ingreso");
  }

  return response.json();
}

export async function updateIncome(
  id: number,
  data: IncomeRequest,
  token: string
): Promise<IncomeResponse> {
  const response = await fetch(`${API_URL}/api/ingresos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error actualizando ingreso");
  }

  return response.json();
}

export async function deleteIncome(
  id: number,
  token: string
): Promise<void> {
  const response = await fetch(`${API_URL}/api/ingresos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error eliminando ingreso");
  }
}