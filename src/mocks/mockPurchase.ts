import { STATUS_PO } from "../constants/enum/enum";
import type { PurchaseOrderType, PurchaseOrderItemType } from "../types/purchaes";

export const mockPurchaseOrders: PurchaseOrderType[] = [
  {
    purchase_order_id: "po-001",
    supplier_id: "SUP001",
    status: STATUS_PO.DRAFT,
    total_amount: 1500,
    create_at: "2025-11-27T09:00:00Z",
    create_by: "admin",
  },
  {
    purchase_order_id: "po-002",
    supplier_id: "SUP003",
    status: STATUS_PO.RECEIVED,
    total_amount: 3200,
    create_at: "2025-11-25T14:30:00Z",
    create_by: "staff1",
  },
];

export const mockPurchaseOrderItems: PurchaseOrderItemType[] = [
  {
    purchase_order_item_id: "poi-001",
    purchase_order_id: "po-001",
    product_id: "1a2b3c4d-0001",
    quantity: 10,
    price: 50,
  },
  {
    purchase_order_item_id: "poi-002",
    purchase_order_id: "po-001",
    product_id: "1a2b3c4d-0002",
    quantity: 20,
    price: 25,
  },
  {
    purchase_order_item_id: "poi-003",
    purchase_order_id: "po-002",
    product_id: "1a2b3c4d-0003",
    quantity: 15,
    price: 80,
  },
];
