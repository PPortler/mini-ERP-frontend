import { useState, useEffect, useCallback } from "react";
import type { ProductStockType } from "../../../../types/product";
import { StockService } from "../../../../services/StockService";


export const useLoadInitialData = (productId: string) => {

    const [product, setProduct] = useState<ProductStockType>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false)

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await StockService.getStockSummaryByProduct(productId)

            if (!res.ok) throw new Error(res.message || "Failed to load");

            setProduct(res.data)
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
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        loading,
        product,
        error,
        refetch: fetchData,
    };
};