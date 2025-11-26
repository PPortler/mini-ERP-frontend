import { useState, useEffect } from "react";
import { ProductService } from "../../../services/ProductService";
import { CatagoriesService } from "../../../services/CatagoriesService";
import type { ProductType } from "../../../types/product";
import type { CatagoriesType } from "../../../types/catagories";

export const useLoadInitialData = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CatagoriesType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, categoryRes] = await Promise.all([
          ProductService.getAll(),
          CatagoriesService.getAll(),
        ]);

        if (productRes.ok) {
          setProducts(productRes.data);
        } else {
          setError(productRes.message || "Failed to load products");
        }

        if (categoryRes.ok) {
          setCategories(categoryRes.data);
        } else {
          setError(categoryRes.message || "Failed to load categories");
        }

      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, categories, loading, error };
};