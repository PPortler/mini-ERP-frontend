import { useState, useEffect, useCallback } from 'react';
import type { CatagoriesType } from '../../../types/catagories';
import { CatagoriesService } from '../../../services/CatagoriesService';
import { LoadingProvider } from '../../../contexts/LoadingContext';
import { useDebouncedValue } from '@mantine/hooks';

export const useLoadInitialData = ({
  initialPage = 1,
  initialPageSize = 10,
  initialSearch = "",
}) => {
  const { setOpenLoading } = LoadingProvider.useLoading()

  const [categories, setCategories] = useState<CatagoriesType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [error, setError] = useState<string | null>(null);

  const [debouncedSearch] = useDebouncedValue(search, 500);

  const fetchData = useCallback(async () => {
    try {
      setOpenLoading(true);
      const [categoryRes] = await Promise.all([
        CatagoriesService.getByPagination(page, pageSize, debouncedSearch),
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
      setOpenLoading(false);
    }
  }, [page, pageSize, debouncedSearch, setOpenLoading]);

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
    setPageSize
  };
};