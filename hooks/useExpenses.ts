import { useEffect, useState } from "react";

import {
    getExpensesByUser,
    createExpense,
    updateExpense,
    deleteExpense,
    ExpenseResponse,
    ExpenseRequest
  
} from "@/src/services/expenseService";

export function useExpenses() {
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadIExpenses() {
    try {
      setLoading(true);

      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!storedUser || !token) return;

      const parsedUser = JSON.parse(storedUser);

      const data = await getExpensesByUser(parsedUser.id, token);

      setExpenses(data);
    } catch (error) {
      console.error("Error cargando gastos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addExpenses(data: ExpenseRequest) {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const newExpense = await createExpense(data, token);

      setExpenses((prev) => [...prev, newExpense]);

      return newExpense;
    } catch (error) {
      console.error("Error creando gasto:", error);
    }
  }

  async function editExpenses(id: number, data: ExpenseRequest) {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const updatedExpense = await updateExpense(id, data, token);

      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === id ? updatedExpense : expense
        )
      );

      return updatedExpense;
    } catch (error) {
      console.error("Error actualizando ingreso:", error);
    }
  }

  useEffect(() => {
    loadIExpenses();
  }, []);

  const totalExpenses = expenses.reduce(
    (acc, expense) => acc + expense.valor,
    0
  );

  return {
    expenses,
    setExpenses,
    totalExpenses,
    loading,
    loadIExpenses,
    addExpenses,
    editExpenses,
  };
}