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
      const resProducts = await ProductService.getByPagination(1, 10, "", "");
      if (!resProducts.ok) throw new Error(resProducts.message || "Failed to load products");

      const productsData = resProducts.data.data;

      const productsWithStock = await Promise.all(
        productsData.map(async (p) => {
          const resStock = await StockService.getStockSummary(p.product_id);
          return {
            ...p,
            stock: resStock.ok ? resStock.data.current_stock ?? 0 : 0,
          };
        })
      );

      // ดึง transactions
      const resTransactions = await StockService.getAll();
      if (!resTransactions.ok) throw new Error(resTransactions.message || "Failed to load stock transactions");

      const transactionsWithProduct = await Promise.all(
        resTransactions.data.map(async (t) => {
          const resProduct = await ProductService.getById(t.product_id);
          // ตรวจสอบว่า resProduct.ok และมีข้อมูลจริง
          const product = resProduct.ok && resProduct.data.length > 0 ? resProduct.data[0] : null;
          return {
            ...t,
            product_name: product?.name || "Unknown"
          };
        })
      );

      setProducts(productsWithStock);
      setTransactions(transactionsWithProduct);
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