import { useEffect, useState, useCallback } from "react";
import { UserService } from "../../../services/UserService";
import type { UserInfoType } from "../../../types/user";

export const useLoadInitialData = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<UserInfoType[]>([]);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await UserService.getAll();

            if (res.ok) {
                setData(res.data || []);
            } else {
                setError(res.message || "error to load data");
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
}
