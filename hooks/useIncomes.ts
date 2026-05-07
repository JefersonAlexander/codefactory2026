import { useEffect, useState } from "react";

import {
  getIncomesByUser,
  createIncome,
  updateIncome,
  IncomeRequest,
  IncomeResponse,
} from "@/src/services/incomeService";

export function useIncomes() {
  const [incomes, setIncomes] = useState<IncomeResponse[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadIncomes() {
    try {
      setLoading(true);

      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!storedUser || !token) return;

      const parsedUser = JSON.parse(storedUser);

      const data = await getIncomesByUser(parsedUser.id, token);

      setIncomes(data);
    } catch (error) {
      console.error("Error cargando ingresos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addIncome(data: IncomeRequest) {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const newIncome = await createIncome(data, token);

      setIncomes((prev) => [...prev, newIncome]);

      return newIncome;
    } catch (error) {
      console.error("Error creando ingreso:", error);
    }
  }

  async function editIncome(id: number, data: IncomeRequest) {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const updatedIncome = await updateIncome(id, data, token);

      setIncomes((prev) =>
        prev.map((income) =>
          income.id === id ? updatedIncome : income
        )
      );

      return updatedIncome;
    } catch (error) {
      console.error("Error actualizando ingreso:", error);
    }
  }

  useEffect(() => {
    loadIncomes();
  }, []);

  const totalIncome = incomes.reduce(
    (acc, income) => acc + income.valor,
    0
  );

  return {
    incomes,
    setIncomes,
    totalIncome,
    loading,
    loadIncomes,
    addIncome,
    editIncome,
  };
}