import { useEffect, useState, useCallback } from "react";
import { SupplierService } from "../../../services/SupplierService";
import type { SupplierType } from "../../../types/suppliers";
import { LoadingProvider } from "../../../contexts/LoadingContext";

export const useLoadInitialData = () => {
    const { setOpenLoading } = LoadingProvider.useLoading()

    const [data, setData] = useState<SupplierType[]>([]);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setOpenLoading(true);
            const res = await SupplierService.getAll();

            if (res.ok) {
                setData(res.data);
            } else {
                setError(res.message || "เกิดข้อผิดพลาด");
            }
        } finally {
            setOpenLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        data,
        error,
        refetch: loadData,
    };
};