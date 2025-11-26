import { useState, useEffect } from "react";
import { ProductService } from "../../../services/ProductService";
import type { ProductType } from "../../../types/product";

export const useLoadInitialData = () => {
    const [minStock, setMinStock] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const res = await ProductService.getAll();

                if (res.ok) {
                    setMinStock(res.data);
                } else {
                    setError(res.message || "Failed to load products");
                }
            } catch (err: any) {
                setError(err.message || "Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { minStock, loading, error };
};