import type { PurchaseOrderType } from "../types/purchaes";
import type { SupplierType } from "../types/suppliers";

export const mapPoOrderWithSupplier = (
  purchaseOrders: PurchaseOrderType[],
  suppliers: SupplierType[]
): PurchaseOrderType[] => {
  return purchaseOrders.map((po) => {
    const supplier = suppliers.find((s) => s.supplier_id === po.supplier_id);
    return {
      ...po,
      supplier_name: supplier?.name,
    };
  });
};