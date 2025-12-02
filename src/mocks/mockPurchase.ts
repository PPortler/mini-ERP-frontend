import { STATUS_PO } from "../constants/enum/enum";
import type { ProductType } from "../types/product";
import type { PurchaseOrderType, PurchaseOrderItemType } from "../types/purchaes";
import type { SupplierType } from "../types/suppliers";
import { getMockProductById } from "./mockProducts";
import { mockSuppliers } from "./mockSuppliers";

type POProduct = ProductType & {
  quantity: number;
  price: number;
};

const getSupplierById = (supplier_id: string): SupplierType | undefined =>
  mockSuppliers.find(s => s.supplier_id === supplier_id);

// Mock PO Items
export const mockPurchaseOrderItems: PurchaseOrderItemType[] = [
  {
    purchase_order_item_id: "poi-001",
    purchase_order_id: "po-001",
    product_id: "1a2b3c4d-0001",
    products: getMockProductById("1a2b3c4d-0001"),
    quantity: 10,
    price: 50,
  },
  {
    purchase_order_item_id: "poi-002",
    purchase_order_id: "po-001",
    product_id: "1a2b3c4d-0002",
    products: getMockProductById("1a2b3c4d-0002"),
    quantity: 20,
    price: 25,
  },
  {
    purchase_order_item_id: "poi-003",
    purchase_order_id: "po-002",
    product_id: "1a2b3c4d-0003",
    products: getMockProductById("1a2b3c4d-0003"),
    quantity: 15,
    price: 80,
  },
];

const getProductsForPO = (po_id: string): POProduct[] => {
  const items = mockPurchaseOrderItems.filter(i => i.purchase_order_id === po_id);
  return items
    .map((i) => {
      const product = getMockProductById(i.product_id);
      if (!product) return null;
      return {
        ...product,
        quantity: i.quantity,
        price: i.price,
      };
    })
    .filter((p): p is POProduct => !!p);
};
export const mockPurchaseOrders: (PurchaseOrderType & { supplier?: SupplierType })[] = [
  {
    purchase_order_id: "po-001",
    supplier_id: "SUP001",
    supplier: getSupplierById("SUP001"),
    status: STATUS_PO.DRAFT,
    total_amount: 1500,
    create_at: "2025-11-27T09:00:00Z",
    products: getProductsForPO("po-001"),
    create_by: "admin",
  },
  {
    purchase_order_id: "po-002",
    supplier_id: "SUP003",
    supplier: getSupplierById("SUP003"),
    status: STATUS_PO.RECEIVED,
    total_amount: 3200,
    create_at: "2025-11-25T14:30:00Z",
    products: getProductsForPO("po-002"),
    create_by: "staff1",
  },
  {
    purchase_order_id: "po-003",
    supplier_id: "SUP004",
    supplier: getSupplierById("SUP004"),
    status: STATUS_PO.CONFIRMED,
    total_amount: 5000,
    create_at: "2025-11-25T14:30:00Z",
    products: getProductsForPO("po-003"),
    create_by: "staff1",
  },
  {
    purchase_order_id: "po-004",
    supplier_id: "SUP005",
    supplier: getSupplierById("SUP002"),
    status: STATUS_PO.CANCELLED,
    total_amount: 5000,
    products: getProductsForPO("po-004"),
    create_at: "2025-11-25T14:30:00Z",
    create_by: "staff1",
  },
];

