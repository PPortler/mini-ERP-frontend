import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Hook สำหรับ sync state กับ URL search params
 * @param stateObj object ที่ต้องการ sync กับ URL
 * @param options.replace ถ้า true จะ replace history แทน push
 */
export const useSyncStateWithSearchParams = <T extends Record<string, string | number | undefined>>(
    stateObj: T,
    options?: { replace?: boolean }
) => {
    const [, setSearchParams] = useSearchParams();

    useEffect(() => {
        const params: Record<string, string> = {};

        Object.entries(stateObj).forEach(([key, value]) => {
            if (value === undefined || value === "" || value === null) return;

            if (typeof value === "number") {
                if (value !== 0) params[key] = value.toString();
            } else {
                params[key] = value;
            }
        });

        setSearchParams(params, { replace: options?.replace ?? true });
    }, [
        ...Object.values(stateObj),
        setSearchParams,
        options?.replace
    ]);
};