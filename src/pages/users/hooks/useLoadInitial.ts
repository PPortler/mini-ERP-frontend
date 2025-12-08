import { useEffect, useState, useCallback } from "react";
import { UserService } from "../../../services/UserService";
import type { UserInfoType } from "../../../types/user";
import { useSearchParams } from "react-router-dom";
import { SEARCH_CONFIG, TABLE_CONFIG } from "../../../constants/enum/enum";
import { useDebouncedValue } from "@mantine/hooks";
import { useSyncStateWithSearchParams } from "../../../hooks/useSyncStateWithSearchParams";

export const useLoadInitialData = () => {
    const [searchParams] = useSearchParams();

    const initialPage = parseInt(searchParams.get("page") || TABLE_CONFIG.DEFAULT_PAGE.toString());
    const initialPageSize = parseInt(searchParams.get("pageSize") || TABLE_CONFIG.DEFAULT_PAGE_SIZE.toString());
    const initialSearch = searchParams.get("debouncedSearch") || "";

    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [search, setSearch] = useState(initialSearch);
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<UserInfoType[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [debouncedSearch] = useDebouncedValue(search, SEARCH_CONFIG.DELAY);

    useSyncStateWithSearchParams({
        page,
        pageSize,
        debouncedSearch,
    });

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await UserService.getByPagination(page, pageSize, debouncedSearch);
            if (!res.ok) throw new Error(res.message || "Failed to load");

            setData(res.data?.data || []);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, debouncedSearch]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        data,
        error,
        loading,
        refetch: loadData,
        setPage,
        setPageSize,
        setSearch,
        page,
        pageSize,
        search,
        setError
    };
}
