import { useState, useEffect, useCallback } from "react";
import type { StockTransactionType } from "../../../types/stockTransection";
import { StockService } from "../../../services/StockService";
import { useDebouncedValue } from "@mantine/hooks";
import type { ProductType } from "../../../types/product";
import { ProductService } from "../../../services/ProductService";
import { useSearchParams } from "react-router-dom";
import { SEARCH_CONFIG, TABLE_CONFIG } from "../../../constants/enum/enum";
import { useSyncStateWithSearchParams } from "../../../hooks/useSyncStateWithSearchParams";

export const useLoadInitialData = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = parseInt(searchParams.get("page") || TABLE_CONFIG.DEFAULT_PAGE.toString());
  const initialPageSize = parseInt(searchParams.get("pageSize") || TABLE_CONFIG.DEFAULT_PAGE_SIZE.toString());
  const initialSearch = searchParams.get("debouncedSearch") || "";
  const initialProductId = searchParams.get("productId") || "";
  const initialSortField = searchParams.get("sortField") || "";
  const initialSortOrder = searchParams.get("sortOrder") || "";

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [productId, setProductId] = useState(initialProductId);
  const [sortField, setSortField] = useState<string>(initialSortField);
  const [sortOrder, setSortOrder] = useState<string>(initialSortOrder);
  const [loading, setLoading] = useState<boolean>(false)
  const [stockTransactions, setTransactions] = useState<StockTransactionType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [debouncedSearch] = useDebouncedValue(search, SEARCH_CONFIG.DELAY);

  useSyncStateWithSearchParams({
    page,
    pageSize,
    debouncedSearch,
    productId,
    sortField,
    sortOrder,
  });

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

      if (resTransactions.data.data.length <= 0 || pageSize <= 0) {
        setPage(TABLE_CONFIG.DEFAULT_PAGE)
        setPageSize(TABLE_CONFIG.DEFAULT_PAGE_SIZE)
      }

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
    setSearchParams,
    setSearch,
    setProductId
  };
};