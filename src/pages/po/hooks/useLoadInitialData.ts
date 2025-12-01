import { useState, useEffect, useCallback } from "react";
import { PurchaseOrderService } from "../../../services/PurchaseOrderService";
import { ProductService } from "../../../services/ProductService";
import { SupplierService } from "../../../services/SupplierService";
import type { PurchaseOrderType } from "../../../types/purchaes";
import { LoadingProvider } from "../../../contexts/LoadingContext";
import type { SupplierType } from "../../../types/suppliers";

export const useLoadInitialData = () => {
    const { setOpenLoading } = LoadingProvider.useLoading()

    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderType[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setOpenLoading(true);

            const [poRes, supplierRes, productRes] = await Promise.all([
                PurchaseOrderService.getAllWithSupplier(),
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
            setOpenLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        purchaseOrders,
        suppliers,
        error,
        refetch: fetchData,
    };
};