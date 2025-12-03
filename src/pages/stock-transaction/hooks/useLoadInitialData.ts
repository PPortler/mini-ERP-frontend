import { useState, useEffect, useCallback } from "react";
import type { StockTransactionType } from "../../../types/stockTransection";
import { StockService } from "../../../services/StockService";
import { useDebouncedValue } from "@mantine/hooks";
import type { ProductType } from "../../../types/product";
import { ProductService } from "../../../services/ProductService";

export const useLoadInitialData = ({
  initialPage = 1,
  initialPageSize = 10,
  initialSearch = "",
  initialProductId = "",
}) => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [productId, setProductId] = useState(initialProductId);
  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false)
  const [stockTransactions, setTransactions] = useState<StockTransactionType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [debouncedSearch] = useDebouncedValue(search);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // ดึง transactions
      const [resTransactions, resProducts] = await Promise.all([
        StockService.getByPagination(page, pageSize, debouncedSearch, productId, sortField, sortOrder),
        ProductService.getAll(),
      ]);

      if (!resTransactions.ok) throw new Error(resTransactions.message || "Failed to load stock transactions");
      if (!resProducts.ok) throw new Error(resProducts.message || "Failed to load");

      setTransactions(resTransactions.data.data);
      setProducts(resProducts.data ?? []);
      setTotal(resTransactions.data.total)
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load stock data");
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, productId, sortField, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stockTransactions,
    products,
    error,
    refetch: fetchData,
    loading,
    total,
    setSortOrder,
    setSortField,
    sortField,
    sortOrder,
    page,
    pageSize,
    setPage,
    setPageSize,
    search,
    productId,
    setSearch,
    setProductId
  };
};