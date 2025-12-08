import { useState, useEffect, useCallback } from "react";
import { PurchaseOrderService } from "../../../services/PurchaseOrderService";
import { ProductService } from "../../../services/ProductService";
import { SupplierService } from "../../../services/SupplierService";
import type { PurchaseOrderType } from "../../../types/purchaes";
import type { SupplierType } from "../../../types/suppliers";
import { useSearchParams } from "react-router-dom";
import { useSyncStateWithSearchParams } from "../../../hooks/useSyncStateWithSearchParams";

export const useLoadInitialData = () => {
    const [searchParams] = useSearchParams();

    const statusParam = searchParams.get("status");
    const initialStatus = statusParam && !isNaN(Number(statusParam))
        ? statusParam
        : "";
        
    const [status, setStatus] = useState<string>(initialStatus);
    const [loading, setLoading] = useState<boolean>(false)
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderType[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
    const [error, setError] = useState<string | null>(null);

    useSyncStateWithSearchParams({
        status,
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const [poRes, supplierRes, productRes] = await Promise.all([
                PurchaseOrderService.getByParams(status),
                SupplierService.getAll(),
                ProductService.getAll(),
            ]);

            if (!poRes.ok) throw new Error(poRes.message || "Failed to load purchase orders");
            if (!supplierRes.ok) throw new Error(supplierRes.message || "Failed to load suppliers");
            if (!productRes.ok) throw new Error(productRes.message || "Failed to load products");

            setPurchaseOrders(poRes.data);
            setSuppliers(supplierRes.data);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to load data");
            }
        } finally {
            setLoading(false);
        }
    }, [status]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        purchaseOrders,
        suppliers,
        error,
        refetch: fetchData,
        loading,
        status,
        setStatus
    };
};