import { useState, useEffect } from "react";
import { ProductService } from "../../../services/ProductService";
import type { ProductType } from "../../../types/product";
import { LoadingProvider } from "../../../contexts/LoadingContext";

export const useLoadInitialData = () => {
    const { setOpenLoading } = LoadingProvider.useLoading()

    const [minStock, setMinStock] = useState<ProductType[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setOpenLoading(true);

                const res = await ProductService.getAll();

                if (res.ok) {
                    setMinStock(res.data);
                } else {
                    setError(res.message || "Failed to load products");
                }
            } catch (err: any) {
                setError(err.message || "Failed to load products");
            } finally {
                setOpenLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { minStock, error };
};