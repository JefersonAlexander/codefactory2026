import { useCallback, useState } from "react";

import {
  getCategoryReport,
  CategoryReportResponse,
} from "@/src/services/categoryReportService";

export function useCategoryReport() {
  const [report, setReport] = useState<CategoryReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getCategoryReport(startDate, endDate);

      console.log("Reporte recibido:", data);
      console.log("Category Expenses:", data?.categoryExpenses);

      setReport(data);

      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error cargando reporte por categorias";

      setError(message);
      console.error("Error cargando reporte por categorias:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    report,
    loading,
    error,
    fetchReport,
  };
}
