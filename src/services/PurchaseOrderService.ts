import { mockPurchaseOrders, mockPurchaseOrderItems } from "../mocks/mockPurchase";
import type { PurchaseOrderType, PurchaseOrderItemType } from "../types/purchaes";
import { AxiosUtil } from "../utils/AxiosUtil";
import { mapPoOrderWithSupplier } from "../utils/mapPoOrderwithSupplier";
import { SupplierService } from "./SupplierService";

export type PurchaseOrderServiceResult =
  | { ok: true; data: PurchaseOrderType[] }
  | { ok: false; message: string };

export const PurchaseOrderService = {
  // GET /purchase-orders
  async getAll(): Promise<PurchaseOrderServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      return { ok: true, data: mockPurchaseOrders };
    }
    return AxiosUtil.createRequest<PurchaseOrderType[]>({
      method: "GET",
      url: "/purchase-orders",
    });
  },

  // GET PO + supplier_name
  async getAllWithSupplier(): Promise<
    | { ok: true; data: PurchaseOrderType[] }
    | { ok: false; message: string }
  > {
    try {
      const [poRes, supplierRes] = await Promise.all([
        this.getAll(),
        SupplierService.getAll(),
      ]);

      if (!poRes.ok) return { ok: false, message: poRes.message };
      if (!supplierRes.ok) return { ok: false, message: supplierRes.message };

      const mapped = mapPoOrderWithSupplier(poRes.data, supplierRes.data);

      return { ok: true, data: mapped };
    } catch (err: any) {
      return { ok: false, message: err.message || "Failed to load purchase orders" };
    }
  },

  // POST /purchase-orders
  async create(po: Omit<PurchaseOrderType, "purchase_order_id">): Promise<PurchaseOrderServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const newPO = { ...po, purchase_order_id: crypto.randomUUID() };
      mockPurchaseOrders.push(newPO);
      return { ok: true, data: [newPO] };
    }
    return AxiosUtil.createRequest<PurchaseOrderType[]>({
      method: "POST",
      url: "/purchase-orders",
      data: po,
    });
  },

  // PUT /purchase-orders/:id
  async update(purchase_order_id: string, po: Partial<PurchaseOrderType>): Promise<PurchaseOrderServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockPurchaseOrders.findIndex(p => p.purchase_order_id === purchase_order_id);
      if (idx === -1) return { ok: false, message: "PO not found (mock)" };
      mockPurchaseOrders[idx] = { ...mockPurchaseOrders[idx], ...po };
      return { ok: true, data: [mockPurchaseOrders[idx]] };
    }
    return AxiosUtil.createRequest<PurchaseOrderType[]>({
      method: "PUT",
      url: `/purchase-orders/${purchase_order_id}`,
      data: po,
    });
  },

  // DELETE /purchase-orders/:id
  async delete(purchase_order_id: string): Promise<PurchaseOrderServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockPurchaseOrders.findIndex(p => p.purchase_order_id === purchase_order_id);
      if (idx === -1) return { ok: false, message: "PO not found (mock)" };
      const deleted = mockPurchaseOrders.splice(idx, 1);
      return { ok: true, data: deleted };
    }
    return AxiosUtil.createRequest<PurchaseOrderType[]>({
      method: "DELETE",
      url: `/purchase-orders/${purchase_order_id}`,
    });
  },

  // GET items by PO ID
  async getItemsByPOId(purchase_order_id: string): Promise<PurchaseOrderItemType[]> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      return mockPurchaseOrderItems.filter(item => item.purchase_order_id === purchase_order_id);
    }
    return AxiosUtil.createRequest<PurchaseOrderItemType[]>({
      method: "GET",
      url: `/purchase-orders/${purchase_order_id}/items`,
    });
  },

  // PUT /purchase-orders/:id/status → เปลี่ยนสถานะ PO
  async updateStatus(purchase_order_id: string, status: string): Promise<PurchaseOrderServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockPurchaseOrders.findIndex(p => p.purchase_order_id === purchase_order_id);
      if (idx === -1) return { ok: false, message: "PO not found (mock)" };
      mockPurchaseOrders[idx].status = status;

      // ถ้า status = RECEIVED → trigger stock IN mock logic
      if (status === "Received") {
        console.log(`[MOCK] Trigger Stock IN for PO ${purchase_order_id}`);
      }

      return { ok: true, data: [mockPurchaseOrders[idx]] };
    }
    return AxiosUtil.createRequest<PurchaseOrderType[]>({
      method: "PUT",
      url: `/purchase-orders/${purchase_order_id}/status`,
      data: { status },
    });
  },

  // เพิ่ม item ให้ PO ใหม่ (mock)
  async addItem(purchase_order_id: string, item: Omit<PurchaseOrderItemType, "purchase_order_item_id">): Promise<PurchaseOrderItemType> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const newItem: PurchaseOrderItemType = { ...item, purchase_order_item_id: crypto.randomUUID() };
      mockPurchaseOrderItems.push(newItem);
      return newItem;
    }
    return AxiosUtil.createRequest<PurchaseOrderItemType>({
      method: "POST",
      url: `/purchase-orders/${purchase_order_id}/items`,
      data: item,
    });
  },

  // แก้ไข item ของ PO
  async updateItem(
    purchase_order_id: string,
    purchase_order_item_id: string,
    item: Partial<PurchaseOrderItemType>
  ): Promise<PurchaseOrderItemType | null> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockPurchaseOrderItems.findIndex(
        (i) => i.purchase_order_item_id === purchase_order_item_id && i.purchase_order_id === purchase_order_id
      );
      if (idx === -1) return null;
      mockPurchaseOrderItems[idx] = { ...mockPurchaseOrderItems[idx], ...item };
      return mockPurchaseOrderItems[idx];
    }
    return AxiosUtil.createRequest<PurchaseOrderItemType>({
      method: "PUT",
      url: `/purchase-orders/${purchase_order_id}/items/${purchase_order_item_id}`,
      data: item,
    });
  },

  // ลบ item ของ PO
  async deleteItem(
    purchase_order_id: string,
    purchase_order_item_id: string
  ): Promise<boolean> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockPurchaseOrderItems.findIndex(
        (i) => i.purchase_order_item_id === purchase_order_item_id && i.purchase_order_id === purchase_order_id
      );
      if (idx === -1) return false;
      mockPurchaseOrderItems.splice(idx, 1);
      return true;
    }
    const res = await AxiosUtil.createRequest<{ success: boolean }>({
      method: "DELETE",
      url: `/purchase-orders/${purchase_order_id}/items/${purchase_order_item_id}`,
    });
    return res.ok ? true : false;
  },
};