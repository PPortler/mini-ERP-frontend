import { useState, useEffect } from "react";
import { ReportService } from "../../../services/ReportServiec";
import type { StockSummaryProductType } from "../../../types/reports";
import { groupByStatusSummary } from "../utils/groupByStatusPerDay";
import { groupByTypePerDay } from "../utils/groupByTypePerDay";
import { useSearchParams } from "react-router-dom";
import { toDDMMYYYY, toMMYYYY } from "../../../utils/formatDate";
import { useSyncStateWithSearchParams } from "../../../hooks/useSyncStateWithSearchParams";

export interface StockMovementChart {
    categories: string[];
    series: { name: string; data: number[] }[];
}

export interface LineChartResult {
    categories: string[];
    series: {
        name: string;
        data: number[];
    }[];
}

export const useLoadInitialData = () => {
    const [searchParams] = useSearchParams();

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const initialFromDateDDMMYYYY = searchParams.get("from") || toDDMMYYYY(startOfMonth);
    const initialToDateDDMMYYYY = searchParams.get("to") || toDDMMYYYY(endOfMonth);
    const initialDateMMYYYY = searchParams.get("month") || toMMYYYY(today);

    const [from, setFrom] = useState(initialFromDateDDMMYYYY);
    const [to, setTo] = useState(initialToDateDDMMYYYY);
    const [month, setMonth] = useState(initialDateMMYYYY);
    const [loading, setLoading] = useState<boolean>(false)
    const [loadStockMovement, setLoadStockMovement] = useState<boolean>(true)
    const [loadPoSummary, setLoadPoSummary] = useState<boolean>(true)
    const [initialLoad, setInitialLoad] = useState<boolean>(true)
    const [lowStock, setLowStock] = useState<StockSummaryProductType[]>([]);
    const [totalCostPrice, setTotalCostPrice] = useState<number>(0);
    const [totalLowStock, setTotalLowStock] = useState<number>(0);
    const [totalStockOnHand, setTotalStockOnHand] = useState<number>(0);
    const [stockMovement, setStockMovement] = useState<StockMovementChart>({
        categories: [],
        series: [],
    });
    const [purchaseTrend, setPurchaseTrend] = useState<LineChartResult>({
        categories: [],
        series: []
    });
    const [error, setError] = useState<string | null>(null);

    const syncParams = { from, to, month };
    useSyncStateWithSearchParams(syncParams);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [resStock] = await Promise.all([
                    ReportService.getStockSummary()
                ]);

                // ---- Stock Low ----
                if (!resStock.ok) throw new Error(resStock.message || "Failed to load");
                setLowStock(resStock.data?.low_stock ?? []);
                setTotalLowStock(resStock.data?.low_stock_count || 0);
                setTotalStockOnHand(resStock.data?.total_stock_on_hand || 0);
                setTotalCostPrice(resStock.data?.total_cost_value || 0);
            } catch (error: unknown) {
                setError(error instanceof Error ? error.message : "Failed to load data");
            } finally {
                setLoading(false);
                setInitialLoad(false);
                setLoadStockMovement(false)
                setLoadPoSummary(false)
            }
        };

        fetchData();
    }, []);

    const fetchStockMovement = async (fromDate: string, toDate: string) => {
        setLoadStockMovement(true);
        try {
            const res = await ReportService.getStockMovements(fromDate, toDate);
            if (!res.ok) throw new Error(res.message || "Failed to load");
            const stockMovements = res.data?.movements ?? [];
            setStockMovement(groupByTypePerDay(stockMovements));
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Failed to load data");
        } finally {
            setLoadStockMovement(false);
        }
    }
    useEffect(() => {
        fetchStockMovement(from, to);
    }, [from, to]);

    const fetchPoSummary = async (monthParam: string) => {
        setLoadPoSummary(true);
        try {
            const res = await ReportService.getPurchaseSummary(monthParam);
            if (!res.ok) throw new Error(res.message || "Failed to load");
            setPurchaseTrend(groupByStatusSummary(res.data?.summary || []));
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Failed to load data");
        } finally {
            setLoadPoSummary(false);
        }
    }

    useEffect(() => {
        fetchPoSummary(month);
    }, [month]);

    return {
        lowStock,
        stockMovement,
        purchaseTrend,
        error,
        loading,
        totalCostPrice,
        totalStockOnHand,
        totalLowStock,
        from,
        to,
        month,
        setMonth,
        setFrom,
        setTo,
        initialLoad,
        loadStockMovement,
        loadPoSummary
    };
};