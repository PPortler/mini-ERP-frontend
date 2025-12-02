import { useState, useEffect } from "react";
import { ProductService } from "../../../services/ProductService";
import type { ProductType } from "../../../types/product";
import { StockService } from "../../../services/StockService";

type StockMovementType = { productName: string; quantity: number };
type PurchaseTrendType = { date: string; count: number };

export const useLoadInitialData = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [minStock, setMinStock] = useState<ProductType[]>([]);
    const [stockMovement, setStockMovement] = useState<StockMovementType[]>([]);
    const [purchaseTrend, setPurchaseTrend] = useState<PurchaseTrendType[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await ProductService.getAll();
                if (!res.ok) {
                    setError(res.message || "Failed to load products");
                    return;
                }
                const products = res.data;
                setMinStock(products ?? []);

                const stockPromises = products?.map(async (product) => {
                    const stockRes = await StockService.getStockSummary(product.product_id);
                    if (stockRes.ok) {
                        return {
                            productName: product.name,
                            quantity: stockRes.data.current_stock ?? 0,
                        };
                    } else {
                        return {
                            productName: product.name,
                            quantity: 0,
                        };
                    }
                });

                const stockResults = await Promise.all(stockPromises ?? []);
                setStockMovement(stockResults);

                // 3) สร้าง purchaseTrend mock
                const purchaseTrendMock: PurchaseTrendType[] = Array.from({ length: 5 }).map((_, idx) => ({
                    date: `2025-11-0${idx + 1}`,
                    count: Math.floor(Math.random() * 15) + 1,
                }));
                setPurchaseTrend(purchaseTrendMock);

            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { minStock, stockMovement, purchaseTrend, error, loading };
};