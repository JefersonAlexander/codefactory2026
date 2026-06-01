const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CategoryReportRequest {
  startDate: string;
  endDate: string;
}

export interface CategoryExpenseReport {
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface CategoryReportResponse {
  startDate: string;
  endDate: string;
  totalExpenses: number;
  categoryExpenses: CategoryExpenseReport[];
}

type CategoryReportApiResponse =
  | CategoryReportResponse
  | {
      data?: CategoryReportResponse;
    };

function getAuthHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function getStoredToken() {
  const token = localStorage.getItem("token");

  if (!token || !token.trim()) {
    console.error("No hay token JWT valido en localStorage");
    throw new Error("No hay token JWT valido para consultar el reporte");
  }

  return token;
}

function normalizeCategoryReport(
  response: CategoryReportApiResponse
): CategoryReportResponse {
  if ("categoryExpenses" in response) {
    return response;
  }

  if (response.data?.categoryExpenses) {
    return response.data;
  }

  throw new Error("La respuesta del reporte por categorias no tiene el formato esperado");
}

export async function getCategoryReport(
  startDate: string,
  endDate: string
): Promise<CategoryReportResponse> {
  const token = getStoredToken();
  const headers = getAuthHeaders(token);
  const endpoint = `${API_URL}/api/reportes/gastos-por-categoria`;
  const payload = {
    startDate,
    endDate,
  } satisfies CategoryReportRequest;

  console.log("Endpoint:", endpoint);
  console.log("Token:", token ? "Presente" : "Ausente");
  console.log("Payload:", payload);

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Error obteniendo el reporte por categorias");
  }

  const data = (await response.json()) as CategoryReportApiResponse;

  console.log("Respuesta reporte:", data);

  return normalizeCategoryReport(data);
}
