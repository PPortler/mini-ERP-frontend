import { useState, useEffect, useCallback } from 'react';
import type { CatagoriesType } from '../../../types/catagories';
import { CatagoriesService } from '../../../services/CatagoriesService';
import { LoadingProvider } from '../../../contexts/LoadingContext';

export const useLoadInitialData = () => {
  const { setOpenLoading } = LoadingProvider.useLoading()

  const [categories, setCategories] = useState<CatagoriesType[]>([]);

  const fetchCategories = useCallback(async () => {
    setOpenLoading(true);
    const res = await CatagoriesService.getAll();
    if (res.ok) setCategories(res.data);
    setOpenLoading(false);
  }, [setOpenLoading]);

  useEffect(() => {
    (async () => {
      await fetchCategories();
    })();
  }, [fetchCategories]);

  return { categories, refetch: fetchCategories };
};