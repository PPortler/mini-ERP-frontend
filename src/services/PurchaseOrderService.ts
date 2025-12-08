import { STATUS_PO } from "../constants/enum/enum";
import { mockPurchaseOrders, mockPurchaseOrderItems } from "../mocks/mockPurchase";
import { mockSuppliers } from "../mocks/mockSuppliers";
import type { PurchaseOrderResponse, PurchaseOrderResponseSingle } from "../types/apiResponse";
import type { PurchaseOrderType, PurchaseOrderItemType } from "../types/purchaes";
import { AxiosUtil } from "../utils/AxiosUtil";

export type PurchaseOrderServiceResult =
  | { ok: true; data: PurchaseOrderType[] }
  | { ok: false; message: string };

export type PurchaseOrderServiceResultSingle =
  | { ok: true; data: PurchaseOrderType }  // object เดียว
  | { ok: false; message: string };

export type PurchaseOrderItemService =
  | { ok: true; data: PurchaseOrderItemType[] }
  | { ok: false; message: string };

export type PurchaseOrderItemServiceSingle =
  | { ok: true; data?: PurchaseOrderItemType }
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

      const orders = res.data.purchase_orders;
      const mappedSupplier: PurchaseOrderType[] = (Array.isArray(orders) ? orders : orders ? [orders] : []).map((po) => ({
        ...po,
        supplier_name: po.supplier?.name || "-",
      }));

      return { ok: true, data: mappedSupplier };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Request error";
      return { ok: false, message };
    }
  },


  async getByParams(
    status = "",
    sortField = ""
  ): Promise<{ ok: true; data: PurchaseOrderType[] } | { ok: false; message: string }> {

    // เรียก backend จริง
    const params = {
      status: status,
      order_by: sortField
    }
    try {
      const res = await AxiosUtil.createRequest<PurchaseOrderResponse>({
        method: "GET",
        url: "/purchase-orders",
        params,
      });
      if (!res.ok) return { ok: false, message: res.message };

      const orders = res.data.purchase_orders;
      const mappedSupplier: PurchaseOrderType[] = (Array.isArray(orders) ? orders : orders ? [orders] : []).map((po) => ({
        ...po,
        supplier_name: po.supplier?.name || "-",
      }));

      return { ok: true, data: mappedSupplier };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  async getById(purchaseOrderId: string): Promise<PurchaseOrderServiceResultSingle> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const po = mockPurchaseOrders.find(po => po.purchase_order_id === purchaseOrderId);
      if (!po) return { ok: false, message: "Purchase order not found" };

      const supplier = mockSuppliers.find(s => s.supplier_id === po.supplier_id);
      return {
        ok: true,
        data: {
          ...po,
          supplier_name: supplier?.name || "-",
        },
      };
    }

    try {
      const res = await AxiosUtil.createRequest<PurchaseOrderResponseSingle>({
        method: "GET",
        url: `/purchase-orders/${purchaseOrderId}`,
      });

      if (!res.ok) return { ok: false, message: res.message };

      const po = res.data.purchase_order;
      if (!po) return { ok: false, message: "Purchase order not found" };

      return {
        ok: true,
        data: {
          ...po,
          supplier_name: po.suppliers?.name || "-",
        } as PurchaseOrderType,
      };
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
        created_by: po.created_by
      }

      const res = await AxiosUtil.createRequest<PurchaseOrderResponse>({
        method: "POST",
        url: "/purchase-orders",
        data: payload,
      });

      if (!res.ok) {
        return { ok: false, message: res.message };
      }

      const list = Array.isArray(res.data.purchase_orders) ? res.data.purchase_orders : [];
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
    status: typeof STATUS_PO.CONFIRMED | typeof STATUS_PO.RECEIVED | typeof STATUS_PO.CANCELLED,
    created_by: string
  ): Promise<PurchaseOrderServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockPurchaseOrders.findIndex(p => p.purchase_order_id === purchase_order_id);
      if (idx === -1) return { ok: false, message: "PO not found (mock)" };

      mockPurchaseOrders[idx].status = status;
      return { ok: true, data: [mockPurchaseOrders[idx]] };
    }

    try {
      const payload = {
        created_by: created_by,
        status: status
      }

      const res = await AxiosUtil.createRequest<PurchaseOrderType[]>({
        method: "PUT",
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
      const payload = {
        supplier_id: po.supplier_id,
        created_by: po.created_by
      }
      const res = await AxiosUtil.createRequest<PurchaseOrderType[]>({
        method: "PUT",
        url: `/purchase-orders/${purchase_order_id}`,
        data: payload,
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
        url: `/purchase-order-items/${purchase_order_id}`,
      });

      if (!res.ok) return { ok: false, message: res.message };

      return { ok: true, data: res.data };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Request error";
      return { ok: false, message };
    }
  },

  // add items to po
  async addItem(
    purchase_order_id: string,
    item: Omit<PurchaseOrderItemType, "purchase_order_item_id">
  ): Promise<PurchaseOrderItemServiceSingle> {

    if (import.meta.env.VITE_USE_MOCK === "true") {
      const newItem: PurchaseOrderItemType = {
        ...item,
        purchase_order_item_id: crypto.randomUUID(),
      };
      mockPurchaseOrderItems.push(newItem);

      return { ok: true, data: newItem };
    }

    try {
      const payload = {
        product_id: item.product_id,
        purchase_order_id: purchase_order_id,
        price: Number(item.price),
        quantity: Number(item.quantity),
      };

      const res = await AxiosUtil.createRequest<PurchaseOrderItemType>({
        method: "POST",
        url: `/purchase-order-items`,
        data: payload,
      });

      if (!res.ok) {
        return { ok: false, message: res.message ?? "Failed to add PO item" };
      }

      return { ok: true, data: res.data };

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      return { ok: false, message: msg };
    }
  },

  // edit item ของ PO
  async updateItem(
    purchase_order_id: string,
    purchase_order_item_id: string,
    item: Partial<PurchaseOrderItemType>
  ): Promise<PurchaseOrderItemServiceSingle> {

    // MOCK mode
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockPurchaseOrderItems.findIndex(
        (i) =>
          i.purchase_order_item_id === purchase_order_item_id &&
          i.purchase_order_id === purchase_order_id
      );

      if (idx === -1) {
        return { ok: false, message: "Item not found" };
      }

      mockPurchaseOrderItems[idx] = {
        ...mockPurchaseOrderItems[idx],
        ...item,
      };

      return { ok: true, data: mockPurchaseOrderItems[idx] };
    }

    // REAL API
    try {
      const payload = {
        product_id: item.product_id,
        price: Number(item.price),
        quantity: Number(item.quantity),
      };

      const res = await AxiosUtil.createRequest<PurchaseOrderItemType>({
        method: "PUT",
        url: `/purchase-order-items/${purchase_order_item_id}`,
        data: payload,
      });

      if (!res.ok) {
        return { ok: false, message: res.message ?? "Failed to update PO item" };
      }

      return { ok: true, data: res.data };

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      return { ok: false, message: msg };
    }
  },

  // ลบ item ของ PO
  async deleteItem(
    purchase_order_id: string,
    purchase_order_item_id: string
  ): Promise<PurchaseOrderItemServiceSingle> {

    // MOCK mode
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockPurchaseOrderItems.findIndex(
        (i) =>
          i.purchase_order_item_id === purchase_order_item_id &&
          i.purchase_order_id === purchase_order_id
      );

      if (idx === -1) {
        return { ok: false, message: "Item not found" };
      }

      mockPurchaseOrderItems.splice(idx, 1);
      return { ok: true };
    }

    // REAL API
    try {
      const res = await AxiosUtil.createRequest<{ success: boolean }>({
        method: "DELETE",
        url: `/purchase-order-items/${purchase_order_item_id}`,
      });

      if (!res.ok) {
        return { ok: false, message: res.message ?? "Failed to delete PO item" };
      }

      return { ok: true };

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      return { ok: false, message: msg };
    }
  }
};