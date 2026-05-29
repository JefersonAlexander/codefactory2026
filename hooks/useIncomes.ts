import { useEffect, useState } from "react";

import {
  getIncomesByUser,
  createIncome,
  updateIncome,
  deleteIncome,
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

      if (!token) throw new Error("No hay token de autenticacion");

      const newIncome = await createIncome(data, token);

      setIncomes((prev) => [...prev, newIncome]);

      return newIncome;
    } catch (error) {
      console.error("Error creando ingreso:", error);
      throw error;
    }
  }

  async function editIncome(id: number, data: IncomeRequest) {
    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("No hay token de autenticacion");

      const updatedIncome = await updateIncome(id, data, token);

      setIncomes((prev) =>
        prev.map((income) =>
          income.id === id ? updatedIncome : income
        )
      );

      return updatedIncome;
    } catch (error) {
      console.error("Error actualizando ingreso:", error);
      throw error;
    }
  }

  async function removeIncome(id: number) {
    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("No hay token de autenticacion");

      await deleteIncome(id, token);

      setIncomes((prev) => prev.filter((income) => income.id !== id));
    } catch (error) {
      console.error("Error eliminando ingreso:", error);
      throw error;
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
    removeIncome,
  };
}
