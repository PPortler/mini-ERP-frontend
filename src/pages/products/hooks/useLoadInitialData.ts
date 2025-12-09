import { useState, useEffect, useCallback } from "react";
import { ProductService } from "../../../services/ProductService";
import { CatagoriesService } from "../../../services/CatagoriesService";
import type { ProductType } from "../../../types/product";
import type { CatagoriesType } from "../../../types/catagories";
import { useDebouncedValue } from "@mantine/hooks";
import { useSearchParams } from "react-router-dom";
import { useSyncStateWithSearchParams } from "../../../hooks/useSyncStateWithSearchParams";
import { SEARCH_CONFIG, TABLE_CONFIG } from "../../../constants/enum/enum";

export const useLoadInitialData = () => {
  const [searchParams] = useSearchParams();

  const initialPage = parseInt(searchParams.get("page") || TABLE_CONFIG.DEFAULT_PAGE.toString());
  const initialPageSize = parseInt(searchParams.get("pageSize") || TABLE_CONFIG.DEFAULT_PAGE_SIZE.toString());
  const initialSearch = searchParams.get("debouncedSearch") || "";
  const initialCategoryId = searchParams.get("categoryId") || "";
  const initialSortField = searchParams.get("sortField") || "";
  const initialSortOrder = searchParams.get("sortOrder") || "";

  const [sortField, setSortField] = useState<string>(initialSortField);
  const [sortOrder, setSortOrder] = useState<string>(initialSortOrder);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CatagoriesType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false)

  const [debouncedSearch] = useDebouncedValue(search, SEARCH_CONFIG.DELAY);

  useSyncStateWithSearchParams({
    page,
    pageSize,
    debouncedSearch,
    categoryId,
    sortField,
    sortOrder,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [productRes, categoryRes] = await Promise.all([
        ProductService.getByPagination(page, pageSize, debouncedSearch, categoryId, sortField, sortOrder),
        CatagoriesService.getAll(),
      ]);

      if (!productRes.ok) throw new Error(productRes.message || "Failed to load");
      if (!categoryRes.ok) throw new Error(categoryRes.message || "Failed to load");

      if (productRes.data.data.length <= 0 || pageSize <= 0) {
        setPage(TABLE_CONFIG.DEFAULT_PAGE)
        setPageSize(TABLE_CONFIG.DEFAULT_PAGE_SIZE)
      }

      setProducts(productRes.data.data);
      setCategories(categoryRes.data ?? []);
      setTotal(productRes.data.total);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load data");
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, categoryId, sortField, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    products,
    categories,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    search,
    categoryId,
    setSearch,
    setCategoryId,
    error,
    refetch: fetchData,
    loading,
    setSortOrder,
    setSortField,
    sortField,
    sortOrder,
  };
};