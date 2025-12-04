import type { ProductType } from "./product";
import type { SupplierType } from "./suppliers";

export type PurchaseOrderType = {
  purchase_order_id: string;
  supplier_id: string;
  status: string;
  total_amount: number;
  created_at?: string;
  created_by?: string;
  supplier_name?: string;
  suppliers?: SupplierType
  products?: ProductType[]
  supplier?: SupplierType
};

export type PurchaseOrderItemType = {
  purchase_order_item_id: string;
  purchase_order_id?: string;
  product_id: string;
  quantity: number;
  products?: ProductType
  price: number;
}