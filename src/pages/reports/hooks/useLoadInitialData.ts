import { useState, useEffect, useCallback } from "react";
import { LoadingProvider } from "../../../contexts/LoadingContext";
import { ReportService } from "../../../services/ReportServiec";
import { ProductService } from "../../../services/ProductService";

const mergeProductToMovements = async (movements: any[]) => {
    return await Promise.all(
        movements.map(async (t) => {
            try {
                const resProduct = await ProductService.getById(t.product_id);
                const product = resProduct.ok && resProduct.data.length > 0 ? resProduct.data[0] : null;
                return {
                    ...t,
                    product_name: product?.name || "Unknown",
                };
            } catch {
                return {
                    ...t,
                    product_name: "Unknown",
                };
            }
        })
    );
};

export const useLoadInitialData = () => {
    const { setOpenLoading } = LoadingProvider.useLoading();

    const [stockSummary, setStockSummary] = useState<any[]>([]);
    const [stockMovements, setStockMovements] = useState<any[]>([]);
    const [purchaseSummary, setPurchaseSummary] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setOpenLoading(true);
        try {
            setError(null);

            const [movements, summary, purchase] = await Promise.all([
                loadMovements(),
                loadStockSummary(),
                loadPurchase(),
            ]);

            // merge product info
            const movementsWithProduct = await mergeProductToMovements(movements);
            setStockMovements(movementsWithProduct);

            setStockSummary(summary);
            setPurchaseSummary(purchase);

        } catch (err: any) {
            setError(err.message || "Failed to load report data");
        } finally {
            setOpenLoading(false);
        }
    }, [setOpenLoading]);

    // โหลดครั้งแรก
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // สำหรับโหลด movements ตามช่วงวันที่
    const loadMovements = async (from?: string, to?: string) => {
        setOpenLoading(true);
        try {
            const res = await ReportService.getStockMovements(from, to);
            if (res.ok) {
                const movementsWithProduct = await mergeProductToMovements(res.data);
                setStockMovements(movementsWithProduct);
                return movementsWithProduct; // ส่งค่ากลับ
            }
            return [];
        } finally {
            setOpenLoading(false);
        }
    };

    // สำหรับโหลด Stock Summary ตามช่วงวันที่
    const loadStockSummary = async (from?: string, to?: string) => {
        setOpenLoading(true);
        try {
            const res = await ReportService.getStockSummary(from, to);
            if (res.ok) {
                setStockSummary(res.data);
                return res.data; // ส่งค่ากลับ
            }
            return [];
        } finally {
            setOpenLoading(false);
        }
    };

    // สำหรับโหลด purchase summary
    const loadPurchase = async (month?: string) => {
        setOpenLoading(true);
        try {
            const res = await ReportService.getPurchaseSummary(month);
            if (res.ok) {
                setPurchaseSummary(res.data);
                return res.data; // ส่งค่ากลับ
            }
            return [];
        } finally {
            setOpenLoading(false);
        }
    };

    return {
        stockSummary,
        stockMovements,
        purchaseSummary,
        error,
        refetch: fetchData,
        loadMovements,
        loadPurchase,
        loadStockSummary
    };
};
