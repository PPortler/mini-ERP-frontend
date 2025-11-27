export type PurchaseOrderType = {
  purchase_order_id: string;
  supplier_id: string;
  status: string;
  total_amount: number;
  create_at?: string;
  create_by?: string;
  supplier_name?: string
};

export type PurchaseOrderItemType = {
    purchase_order_item_id: string;
    purchase_order_id?: string;
    product_id: string;
    quantity: number;
    price: number;
}