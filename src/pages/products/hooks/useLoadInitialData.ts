import { useState, useEffect, useCallback } from "react";
import { ProductService } from "../../../services/ProductService";
import { CatagoriesService } from "../../../services/CatagoriesService";
import type { ProductType } from "../../../types/product";
import type { CatagoriesType } from "../../../types/catagories";
import { useDebouncedValue } from "@mantine/hooks";

export const useLoadInitialData = ({
  initialPage = 1,
  initialPageSize = 10,
  initialSearch = "",
  initialCategoryId = "",
}) => {

  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CatagoriesType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false)

  const [debouncedSearch] = useDebouncedValue(search);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [productRes, categoryRes] = await Promise.all([
        ProductService.getByPagination(page, pageSize, debouncedSearch, categoryId, sortField, sortOrder),
        CatagoriesService.getAll(),
      ]);

      if (!productRes.ok) throw new Error(productRes.message || "Failed to load");
      if (!categoryRes.ok) throw new Error(categoryRes.message || "Failed to load");

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
    sortOrder
  };
};