import { useState, useEffect } from "react";
import type { ProductType } from "../../../types/product";
import type { StockTransactionType } from "../../../types/stockTransection";
import { ProductService } from "../../../services/ProductService";
import { StockService } from "../../../services/StockService";

export const useLoadInitialData = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [stockTransactions, setTransactions] = useState<StockTransactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // ดึงสินค้า
        const resProducts = await ProductService.getAll();
        if (!resProducts.ok) throw new Error(resProducts.message || "Failed to load products");

        // ดึง transactions
        const resTransactions = await StockService.getAll();
        if (!resTransactions.ok) throw new Error(resTransactions.message || "Failed to load stock transactions");

        const productsWithStock = resProducts.data.map(p => {
          const productTransactions = resTransactions.data.filter(t => t.product_id === p.product_id);
          const stock =
            productTransactions
              .filter(t => t.type === "IN")
              .reduce((sum, t) => sum + t.quantity, 0) -
            productTransactions
              .filter(t => t.type === "OUT")
              .reduce((sum, t) => sum + t.quantity, 0) +
            productTransactions
              .filter(t => t.type === "ADJUST")
              .reduce((sum, t) => sum + t.quantity, 0);

          return { ...p, stock };
        });

        setProducts(productsWithStock);
        setTransactions(resTransactions.data);
      } catch (err: any) {
        setError(err.message || "Failed to load stock data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, stockTransactions, loading, error };
};