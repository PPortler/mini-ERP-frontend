import { useState, useEffect, useCallback } from "react";
import { PurchaseOrderService } from "../../../../services/PurchaseOrderService";
import type { PurchaseOrderItemType } from "../../../../types/purchaes";
import { LoadingProvider } from "../../../../contexts/LoadingContext";

export const useLoadInitialData = (purchase_order_id: string) => {
  const { setOpenLoading } = LoadingProvider.useLoading()

  const [poItems, setPoItems] = useState<PurchaseOrderItemType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setOpenLoading(true);
      const data = await PurchaseOrderService.getItemsByPOId(purchase_order_id);
      setPoItems(data);
    } catch (err: any) {
      setError(err.message || "Failed to load PO items");
    } finally {
      setOpenLoading(false);
    }
  }, [purchase_order_id]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { poItems, error, refetch: fetchItems };
};