import { useState, useEffect, useCallback } from "react";
import type { ProductType } from "../../../types/product";
import type { StockTransactionType } from "../../../types/stockTransection";
import { ProductService } from "../../../services/ProductService";
import { StockService } from "../../../services/StockService";
import { LoadingProvider } from "../../../contexts/LoadingContext";

export const useLoadInitialData = () => {
  const { setOpenLoading } = LoadingProvider.useLoading();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [stockTransactions, setTransactions] = useState<StockTransactionType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setOpenLoading(true);
    try {
      // ดึงสินค้า
      const resProducts = await ProductService.getAll();
      if (!resProducts.ok) throw new Error(resProducts.message || "Failed to load products");

      // ดึง transactions
      const resTransactions = await StockService.getAll();
      if (!resTransactions.ok) throw new Error(resTransactions.message || "Failed to load stock transactions");


      // ดึง stock summary ของแต่ละสินค้า
      const productsWithStock: (ProductType & { stock: number })[] = await Promise.all(
        resProducts.data.map(async (p) => {
          const resStock = await StockService.get(p.product_id);
          return { ...p, stock: resStock.ok ? resStock.data.stock : 0 };
        })
      );

      setProducts(productsWithStock);
      setTransactions(resTransactions.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load stock data");
    } finally {
      setOpenLoading(false);
    }
  }, [setOpenLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { products, stockTransactions, error, refetch: fetchData };
};