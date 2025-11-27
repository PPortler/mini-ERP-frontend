import { useState, useEffect, useCallback } from "react";
import { ProductService } from "../../../services/ProductService";
import { CatagoriesService } from "../../../services/CatagoriesService";
import type { ProductType } from "../../../types/product";
import type { CatagoriesType } from "../../../types/catagories";
import { LoadingProvider } from "../../../contexts/LoadingContext";

export const useLoadInitialData = () => {
  const { setOpenLoading } = LoadingProvider.useLoading()

  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CatagoriesType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setOpenLoading(true);
      const [productRes, categoryRes] = await Promise.all([
        ProductService.getAll(),
        CatagoriesService.getAll(),
      ]);

      if (!productRes.ok) throw new Error(productRes.message || "Failed to load");
      if (!categoryRes.ok) throw new Error(categoryRes.message || "Failed to load");

      const mappedProducts = productRes.data.map(p => {
        const category = categoryRes.data.find(c => c.category_id === p.category_id);
        return { ...p, category_name: category?.name };
      });

      setProducts(mappedProducts);
      setCategories(categoryRes.data);
      setError(null); // clear previous error
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setOpenLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { products, categories, error, refetch: fetchData };
};