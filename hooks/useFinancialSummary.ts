import { useEffect, useState } from "react";

import { getIncomesByUser } from "@/src/services/incomeService";
import { getExpensesByUser } from "@/src/services/expenseService";

import { IncomeResponse } from "@/src/services/incomeService";
import { ExpenseResponse } from "@/src/services/expenseService";

export function useFinancialSummary() {
  const [incomes, setIncomes] = useState<IncomeResponse[]>([]);
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) return;

        const parsedUser = JSON.parse(storedUser);

        const [incomeData, expenseData] = await Promise.all([
          getIncomesByUser(parsedUser.id, token),
          getExpensesByUser(parsedUser.id, token), 
        ]);

        setIncomes(incomeData);
        setExpenses(expenseData);

        const incomeTotal = incomeData.reduce(
          (acc, income) => acc + income.valor,
          0
        );

        const expenseTotal = expenseData.reduce(
          (acc, expense) => acc + expense.valor,
          0
        );

        setTotalIncome(incomeTotal);
        setTotalExpenses(expenseTotal);

      } catch (error) {
        console.error("Error cargando resumen financiero:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return {
    incomes,
    expenses,
    totalIncome,
    totalExpenses,
    loading,
  };
}