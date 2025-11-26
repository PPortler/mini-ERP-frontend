import { useState, useEffect, useCallback } from 'react';
import type { CatagoriesType } from '../../../types/catagories';
import { CatagoriesService } from '../../../services/CatagoriesService';

export const useLoadInitialData = () => {
  const [categories, setCategories] = useState<CatagoriesType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const res = await CatagoriesService.getAll();
    if (res.ok) setCategories(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      await fetchCategories();
    })();
  }, [fetchCategories]);

  return { categories, loading, refetch: fetchCategories };
};