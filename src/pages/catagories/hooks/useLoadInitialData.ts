import { useState, useEffect, useCallback } from 'react';
import type { CatagoriesType } from '../../../types/catagories';
import { CatagoriesService } from '../../../services/CatagoriesService';
import { useDebouncedValue } from '@mantine/hooks';
import { SEARCH_CONFIG, TABLE_CONFIG } from '../../../constants/enum/enum';
import { useSearchParams } from 'react-router-dom';
import { useSyncStateWithSearchParams } from '../../../hooks/useSyncStateWithSearchParams';

export const useLoadInitialData = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = parseInt(searchParams.get("page") || TABLE_CONFIG.DEFAULT_PAGE.toString());
  const initialPageSize = parseInt(searchParams.get("pageSize") || TABLE_CONFIG.DEFAULT_PAGE_SIZE.toString());
  const initialSearch = searchParams.get("debouncedSearch") || "";
  const initialSortField = searchParams.get("sortField") || "";
  const initialSortOrder = searchParams.get("sortOrder") || "";

  const [categories, setCategories] = useState<CatagoriesType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [sortField, setSortField] = useState<string>(initialSortField);
  const [sortOrder, setSortOrder] = useState<string>(initialSortOrder);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); 

  const [debouncedSearch] = useDebouncedValue(search, SEARCH_CONFIG.DELAY);

  useSyncStateWithSearchParams({
    page,
    pageSize,
    debouncedSearch,
    sortField,
    sortOrder,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [categoryRes] = await Promise.all([
        CatagoriesService.getByPagination(page, pageSize, debouncedSearch, sortField, sortOrder),
      ]);

      if (!categoryRes.ok) throw new Error(categoryRes.message || "Failed to load");

      if (categoryRes.data.data.length <= 0 || pageSize <= 0) {
        setPage(TABLE_CONFIG.DEFAULT_PAGE)
        setPageSize(TABLE_CONFIG.DEFAULT_PAGE_SIZE)
      }

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
    setSearchParams,
    sortField,
    sortOrder
  };
};