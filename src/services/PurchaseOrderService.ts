import { STATUS_PO } from "../constants/enum/enum";
import { mockPurchaseOrders, mockPurchaseOrderItems } from "../mocks/mockPurchase";
import { mockSuppliers } from "../mocks/mockSuppliers";
import type { PurchaseOrderResponse } from "../types/apiResponse";
import type { PurchaseOrderType, PurchaseOrderItemType } from "../types/purchaes";
import { AxiosUtil } from "../utils/AxiosUtil";

export type PurchaseOrderServiceResult =
  | { ok: true; data: PurchaseOrderType[] }
  | { ok: false; message: string };

export type PurchaseOrderItemService =
  | { ok: true; data: PurchaseOrderItemType[] }
  | { ok: false; message: string };

export const PurchaseOrderService = {
  async getAll(): Promise<PurchaseOrderServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const dataWithSupplierName = mockPurchaseOrders.map(po => {
        const supplier = mockSuppliers.find(s => s.supplier_id === po.supplier_id);
        return {
          ...po,
          supplier_name: supplier?.name || "-",
        };
      });
      return { ok: true, data: dataWithSupplierName };
    }

    try {
      const res = await AxiosUtil.createRequest<PurchaseOrderResponse>({
        method: "GET",
        url: "/purchase-orders",
      });
      if (!res.ok) return { ok: false, message: res.message };

      const mappedSupplier: PurchaseOrderType[] = (res.data.purchaseOrders ?? []).map((po) => ({
        ...po,
        supplier_name: po.suppliers?.name || "-",
      }));

      return { ok: true, data: mappedSupplier };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Request error";
      return { ok: false, message };
    }
  },

  async create(po: Omit<PurchaseOrderType, "purchase_order_id">): Promise<PurchaseOrderServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const newPO = { ...po, purchase_order_id: crypto.randomUUID() };
      mockPurchaseOrders.push(newPO);
      return { ok: true, data: [newPO] };
    }
    try {
      const payload = {
        supplier_id: po.supplier_id,
        status: STATUS_PO.DRAFT
      }

      const res = await AxiosUtil.createRequest<PurchaseOrderResponse>({
        method: "POST",
        url: "/purchase-orders",
        data: payload,
      });

      if (!res.ok) {
        return { ok: false, message: res.message };
      }

      const list = Array.isArray(res.data.purchaseOrders) ? res.data.purchaseOrders : [];
      return {
        ok: true,
        data: list,
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Request error";
      return { ok: false, message };
    }
  },

  async updateStatus(
    purchase_order_id: string,
    status: typeof STATUS_PO.CONFIRMED | typeof STATUS_PO.RECEIVED | typeof STATUS_PO.CANCELLED
  ): Promise<PurchaseOrderServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockPurchaseOrders.findIndex(p => p.purchase_order_id === purchase_order_id);
      if (idx === -1) return { ok: false, message: "PO not found (mock)" };

      mockPurchaseOrders[idx].status = status;
      return { ok: true, data: [mockPurchaseOrders[idx]] };
    }

    try {
      const payload = {
        status: status
      }

      const res = await AxiosUtil.createRequest<PurchaseOrderType[]>({
        method: "PATCH",
        url: `/purchase-orders/${purchase_order_id}/status`,
        data: payload,
      });

      if (!res.ok) return { ok: false, message: res.message || "Failed to update PO status" };

      return { ok: true, data: res.data };
    } catch (err: unknown) {
      let message = "Failed to update PO status";
      if (err instanceof Error) message = err.message;
      return { ok: false, message };
    }
  },

  async update(purchase_order_id: string, po: Partial<PurchaseOrderType>): Promise<PurchaseOrderServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockPurchaseOrders.findIndex(p => p.purchase_order_id === purchase_order_id);
      if (idx === -1) return { ok: false, message: "PO not found (mock)" };
      mockPurchaseOrders[idx] = { ...mockPurchaseOrders[idx], ...po };
      return { ok: true, data: [mockPurchaseOrders[idx]] };
    }
    try {
      const res = await AxiosUtil.createRequest<PurchaseOrderType[]>({
        method: "PATCH",
        url: `/purchase-orders/${purchase_order_id}`,
        data: po,
      });
      if (!res.ok) return { ok: false, message: res.message || "Failed to update PO status" };

      return {
        ok: true,
        data: res.data
      }
    } catch (err: unknown) {
      let message = "Failed to update PO";
      if (err instanceof Error) message = err.message;
      return { ok: false, message };
    }
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
  async getItemsByPOId(purchase_order_id: string): Promise<PurchaseOrderItemService> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const items = mockPurchaseOrderItems.filter(
        (item) => item.purchase_order_id === purchase_order_id
      );
      return { ok: true, data: items };
    }

    try {
      const res = await AxiosUtil.createRequest<PurchaseOrderItemType[]>({
        method: "GET",
        url: `/purchase-orders/${purchase_order_id}/items`,
      });

      if (!res.ok) return { ok: false, message: res.message };

      return { ok: true, data: res.data };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Request error";
      return { ok: false, message };
    }
  },

  async addItem(
    purchase_order_id: string,
    item: Omit<PurchaseOrderItemType, "purchase_order_item_id">
  ): Promise<PurchaseOrderItemType> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const newItem: PurchaseOrderItemType = {
        ...item,
        purchase_order_item_id: crypto.randomUUID(),
      };
      mockPurchaseOrderItems.push(newItem);
      return newItem;
    }

    try {
      const res = await AxiosUtil.createRequest<PurchaseOrderItemType>({
        method: "POST",
        url: `/purchase-orders/${purchase_order_id}/items`,
        data: item,
      });

      if (!res.ok) {
        throw new Error(res.message || "Failed to add PO item");
      }

      return res.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("เกิดข้อผิดพลาด");
    }
  },

  // แก้ไข item ของ PO
  async updateItem(
    purchase_order_id: string,
    purchase_order_item_id: string,
    item: Partial<PurchaseOrderItemType>
  ): Promise<PurchaseOrderItemType | null> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockPurchaseOrderItems.findIndex(
        (i) =>
          i.purchase_order_item_id === purchase_order_item_id &&
          i.purchase_order_id === purchase_order_id
      );
      if (idx === -1) return null;
      mockPurchaseOrderItems[idx] = { ...mockPurchaseOrderItems[idx], ...item };
      return mockPurchaseOrderItems[idx];
    }

    try {
      const res = await AxiosUtil.createRequest<PurchaseOrderItemType>({
        method: "PUT",
        url: `/purchase-orders/${purchase_order_id}/items/${purchase_order_item_id}`,
        data: item,
      });

      if (!res.ok) {
        throw new Error(res.message || "Failed to update PO item");
      }

      return res.data;
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
      throw new Error("เกิดข้อผิดพลาด");
    }
  },

  // ลบ item ของ PO
  async deleteItem(
    purchase_order_id: string,
    purchase_order_item_id: string
  ): Promise<boolean> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockPurchaseOrderItems.findIndex(
        (i) =>
          i.purchase_order_item_id === purchase_order_item_id &&
          i.purchase_order_id === purchase_order_id
      );
      if (idx === -1) return false;
      mockPurchaseOrderItems.splice(idx, 1);
      return true;
    }

    try {
      const res = await AxiosUtil.createRequest<{ success: boolean }>({
        method: "DELETE",
        url: `/purchase-orders/${purchase_order_id}/items/${purchase_order_item_id}`,
      });

      if (!res.ok) {
        throw new Error(res.message || "Failed to delete PO item");
      }

      return true;
    } catch (err: unknown) {
      console.error(err);
      return false; // หรือ throw err ขึ้นไปแล้วให้ caller handle
    }
  }
};