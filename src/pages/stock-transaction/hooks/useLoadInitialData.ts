import { useState, useEffect, useCallback } from "react";
import type { StockTransactionType } from "../../../types/stockTransection";
import { StockService } from "../../../services/StockService";
import { LoadingProvider } from "../../../contexts/LoadingContext";

export const useLoadInitialData = () => {
  const { setOpenLoading } = LoadingProvider.useLoading();

  const [stockTransactions, setTransactions] = useState<StockTransactionType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setOpenLoading(true);
    try {
      // ดึง transactions
      const resTransactions = await StockService.getAll();
      if (!resTransactions.ok) throw new Error(resTransactions.message || "Failed to load stock transactions");


      setTransactions(resTransactions.data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load stock data");
      }
    } finally {
      setOpenLoading(false);
    }
  }, [setOpenLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stockTransactions, error, refetch: fetchData };
};