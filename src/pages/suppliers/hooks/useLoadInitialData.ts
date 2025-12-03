import { useEffect, useState, useCallback } from "react";
import { SupplierService } from "../../../services/SupplierService";
import type { SupplierType } from "../../../types/suppliers";

export const useLoadInitialData = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<SupplierType[]>([]);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await SupplierService.getAll();

            if (res.ok) {
                setData(res.data);
            } else {
                setError(res.message || "เกิดข้อผิดพลาด");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        data,
        error,
        loading,
        refetch: loadData,
    };
};