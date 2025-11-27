import { useState, useEffect, useCallback } from "react";
import { PurchaseOrderService } from "../../../services/PurchaseOrderService";
import { ProductService } from "../../../services/ProductService";
import { SupplierService } from "../../../services/SupplierService";
import type { PurchaseOrderType } from "../../../types/purchaes";
import type { SupplierType } from "../../../types/suppliers";
import type { ProductType } from "../../../types/product";
import { LoadingProvider } from "../../../contexts/LoadingContext";

export const useLoadInitialData = () => {
    const { setOpenLoading } = LoadingProvider.useLoading()

    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderType[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setOpenLoading(true);

            const [poRes, supplierRes, productRes] = await Promise.all([
                PurchaseOrderService.getAll(),
                SupplierService.getAll(),
                ProductService.getAll(),
            ]);

            if (!poRes.ok) throw new Error(poRes.message || "Failed to load purchase orders");
            if (!supplierRes.ok) throw new Error(supplierRes.message || "Failed to load suppliers");
            if (!productRes.ok) throw new Error(productRes.message || "Failed to load products");

            // map supplier_name
            const dataWithSupplier = poRes.data.map(po => {
                const supplier = supplierRes.data.find(s => s.supplier_id === po.supplier_id);
                return { ...po, supplier_name: supplier?.name || "-" };
            });

            setPurchaseOrders(dataWithSupplier);
            setSuppliers(supplierRes.data);
            setProducts(productRes.data);

        } catch (err: any) {
            setError(err.message || "Failed to load data");
        } finally {
            setOpenLoading(false);
        }
    }, []);

    // โหลดครั้งแรก
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        purchaseOrders,
        suppliers,
        products,
        error,
        refetch: fetchData, // ให้เรียก reload ข้อมูลใหม่ได้
    };
};