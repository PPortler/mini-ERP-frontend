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
  purchase_order_items?: ProductType[]
  supplier?: SupplierType
  products?: ProductType[]
  image_url?: string | File
};

export type PurchaseOrderItemType = {
  purchase_order_item_id: string;
  purchase_order_id?: string;
  product_id: string;
  quantity: number;
  products?: ProductType
  product?: ProductType
  price?: number;
}