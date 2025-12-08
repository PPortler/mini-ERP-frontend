import { useState, useCallback, useEffect } from "react";
import { ReportService } from "../../../services/ReportServiec";
import type { PurchaseSummaryItemType, StockMovementItemType, StockSummaryProductType } from "../../../types/reports";
import { toDDMMYYYY, toMMYYYY } from "../../../utils/formatDate";
import { useSearchParams } from "react-router-dom";
import { useSyncStateWithSearchParams } from "../../../hooks/useSyncStateWithSearchParams";
import { TAB_TYPES_REPORTS } from "../const/enum";

export const useLoadInitialData = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const initialFromDateDDMMYYYY = searchParams.get("from") || toDDMMYYYY(startOfMonth);
    const initialToDateDDMMYYYY = searchParams.get("to") || toDDMMYYYY(endOfMonth);
    const initialDateMMYYYY = searchParams.get("month") || toMMYYYY(today);
    const initialTab = searchParams.get("tab") || TAB_TYPES_REPORTS.SUMMARY;

    const [from, setFrom] = useState(initialFromDateDDMMYYYY);
    const [to, setTo] = useState(initialToDateDDMMYYYY);
    const [month, setMonth] = useState(initialDateMMYYYY);
    const [tab, setTab] = useState(initialTab);
    const [loading, setLoading] = useState<boolean>(false)
    const [initialLoad, setInitialLoad] = useState<boolean>(true)
    const [stockSummary, setStockSummary] = useState<StockSummaryProductType[]>([]);
    const [stockMovements, setStockMovements] = useState<StockMovementItemType[]>([]);
    const [purchaseSummary, setPurchaseSummary] = useState<PurchaseSummaryItemType[]>([]);
    const [error, setError] = useState<string | null>(null);

    const syncParams = { tab, from, to, month };
    useSyncStateWithSearchParams(syncParams);

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            if (tab === TAB_TYPES_REPORTS.SUMMARY) {
                const res = await ReportService.getStockSummary();
                if (!res.ok) throw new Error(res.message);
                setStockSummary(res.data?.products || []);
            }

            if (tab === TAB_TYPES_REPORTS.MOVEMENTS) {
                const res = await ReportService.getStockMovements(from, to);
                if (!res.ok) throw new Error(res.message);
                setStockMovements(res.data?.movements || []);
            }

            if (tab === TAB_TYPES_REPORTS.PURCHASES) {
                const res = await ReportService.getPurchaseSummary(month);
                if (!res.ok) throw new Error(res.message);
                setPurchaseSummary(res.data?.summary || []);
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to load data");
            }
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    }, [from, to, month, tab])

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
        tab,
        setTab,
        setSearchParams,
        stockSummary,
        stockMovements,
        purchaseSummary,
        loading,
        error,
        refetch: fetchData,
        initialLoad
    };
};
