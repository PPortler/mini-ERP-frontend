import { useState, useEffect, useCallback } from "react";
import { PurchaseOrderService } from "../../../../services/PurchaseOrderService";
import { ProductService } from "../../../../services/ProductService";
import type { PurchaseOrderItemType } from "../../../../types/purchaes";
import type { ProductType } from "../../../../types/product";

export const useLoadInitialData = (purchase_order_id: string) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [poItems, setPoItems] = useState<PurchaseOrderItemType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch PO items
      const poRes = await PurchaseOrderService.getItemsByPOId(purchase_order_id);
      setPoItems(poRes.data || []);

      // Fetch products
      const productRes = await ProductService.getAll();
      if (productRes.ok) setProducts(productRes.data ?? []);
      else setProducts([]);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [purchase_order_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { poItems, products, error, refetch: fetchData, loading };
};