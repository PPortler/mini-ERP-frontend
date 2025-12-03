import { useState, useEffect, useCallback } from 'react';
import type { CatagoriesType } from '../../../types/catagories';
import { CatagoriesService } from '../../../services/CatagoriesService';
import { useDebouncedValue } from '@mantine/hooks';

export const useLoadInitialData = ({
  initialPage = 1,
  initialPageSize = 10,
  initialSearch = "",
}) => {

  const [categories, setCategories] = useState<CatagoriesType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // เพิ่ม loading state

  const [debouncedSearch] = useDebouncedValue(search);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [categoryRes] = await Promise.all([
        CatagoriesService.getByPagination(page, pageSize, debouncedSearch, sortField, sortOrder),
      ]);

      if (!categoryRes.ok) throw new Error(categoryRes.message || "Failed to load");

      setCategories(categoryRes.data.data);
      setTotal(categoryRes.data.total);
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
  }, [page, pageSize, debouncedSearch, sortField, sortOrder]);

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, [fetchData]);

  return {
    categories,
    refetch: fetchData,
    total,
    setPage,
    pageSize,
    page,
    search,
    setSearch,
    error,
    setPageSize,
    loading,
    setSortOrder,
    setSortField,
    sortField,
    sortOrder
  };
};