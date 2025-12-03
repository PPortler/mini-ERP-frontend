import { useState, useCallback, useEffect } from "react";
import { ReportService } from "../../../services/ReportServiec";
import type { PurchaseSummaryItemType, StockMovementItemType, StockSummaryProductType } from "../../../types/reports";
import { toDDMMYYYY, toMMYYYY } from "../../../utils/formatDate";

export const useLoadInitialData = () => {
    const today = new Date();

    const [from, setFrom] = useState(toDDMMYYYY(today));
    const [to, setTo] = useState(toDDMMYYYY(today));
    const [month, setMonth] = useState(toMMYYYY(today));

    const [loading, setLoading] = useState<boolean>(false)
    const [stockSummary, setStockSummary] = useState<StockSummaryProductType[]>([]);
    const [stockMovements, setStockMovements] = useState<StockMovementItemType[]>([]);
    const [purchaseSummary, setPurchaseSummary] = useState<PurchaseSummaryItemType[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [resStSummary, resStMovement, resPoSummary] = await Promise.all([
                ReportService.getStockSummary(),
                ReportService.getStockMovements(from, to),
                ReportService.getPurchaseSummary(month),
            ]);

            if (!resStSummary.ok) throw new Error(resStSummary.message || "Failed to load");
            setStockSummary(resStSummary.data?.products || [])
            if (!resStMovement.ok) throw new Error(resStMovement.message || "Failed to load");
            setStockMovements(resStMovement.data?.movements || [])
            if (!resPoSummary.ok) throw new Error(resPoSummary.message || "Failed to load");
            setPurchaseSummary(resPoSummary.data?.summary || [])

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to load data");
            }
        } finally {
            setLoading(false);
        }
    }, [from, to, month])

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        from,
        to,
        month,
        setFrom,
        setMonth,
        setTo,
        stockSummary,
        stockMovements,
        purchaseSummary,
        loading,
        error,
        refetch: fetchData,
    };
};
