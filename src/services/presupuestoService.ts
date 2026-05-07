const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type currentBudget = {
  id: number;
  valor: number;
  fecha: string;
  fechaVencimiento: string;
  idUsuario: number;
  activo: boolean;
};

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getPresupuestoActivo(): Promise<currentBudget> {
  const response = await fetch(`${API_URL}/api/presupuesto`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error obteniendo el presupuesto activo");
  }

  return response.json();
}

export async function crearPresupuesto(valor: number): Promise<currentBudget> {
  const response = await fetch(`${API_URL}/api/presupuesto`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      valor,
    }),
  });

  if (!response.ok) {
    throw new Error("Error creando el presupuesto");
  }

  return response.json();
}

export async function getHistorialPresupuestos(): Promise<currentBudget[]> {
  const response = await fetch(`${API_URL}/presupuesto/historial`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error obteniendo el historial de presupuestos");
  }

  return response.json();
}

export async function actualizarPresupuesto(valor: number) {
  const response = await fetch(`${API_URL}/api/presupuesto`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ valor }),
  });

  if (!response.ok) {
    throw new Error("Error actualizando presupuesto");
  }

  return response.json();
}