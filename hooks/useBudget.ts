import { useEffect, useState } from "react";

import {
  getPresupuestoActivo,
  currentBudget,
} from "@/src/services/presupuestoService";

export function useBudget() {
  const [presupuesto, setPresupuesto] = useState<currentBudget | null>(null);
  const [historial, setHistorial] = useState<currentBudget[]>([]);
  const [indexActual, setIndexActual] = useState(0);
  const [editBudget, setEditBudget] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No hay token en localStorage");
          return;
        }

        const presupuestoActivo = await getPresupuestoActivo();

        setPresupuesto(presupuestoActivo);
        setEditBudget(String(presupuestoActivo.valor));
      } catch (error) {
        console.error("Error cargando presupuesto:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return {
    presupuesto,
    setPresupuesto,
    indexActual,
    setIndexActual,
    editBudget,
    setEditBudget,
    loading,
  };
}