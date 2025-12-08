import { useState, useEffect, useCallback } from "react";
import { PurchaseOrderService } from "../../../../services/PurchaseOrderService";
import { ProductService } from "../../../../services/ProductService";
import type { PurchaseOrderItemType, PurchaseOrderType } from "../../../../types/purchaes";
import type { ProductType } from "../../../../types/product";

export const useLoadInitialData = (purchase_order_id: string) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [poItems, setPoItems] = useState<PurchaseOrderItemType[]>([]);
  const [poOrderInfo, setPoOrderInfo] = useState<PurchaseOrderType>();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch PO items
      const poRes = await PurchaseOrderService.getItemsByPOId(purchase_order_id);

      if(!poRes.ok) throw new Error(poRes.message || "Failed to fetch PO items");
      setPoItems(poRes.data.purchase_order_items);

      // Fetch PO order info
      const poOrderRes = await PurchaseOrderService.getById(purchase_order_id);
      if(!poOrderRes.ok) throw new Error(poOrderRes.message || "Failed to fetch PO order info");
      setPoOrderInfo(poOrderRes.data!);

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

  return { poItems, products, error, refetch: fetchData, loading, poOrderInfo };
};