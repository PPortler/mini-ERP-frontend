import { AxiosUtil } from "../utils/AxiosUtil";
import { mockSuppliers } from "../mocks/mockSuppliers";
import type { SupplierType } from "../types/suppliers";
import type { SupplierResponse } from "../types/apiResponse";

export type SupplierListResponse = SupplierType[];

export type SupplierServiceResult =
  | { ok: true; data: SupplierListResponse; message?: string }
  | { ok: false; message: string };

export const SupplierService = {
  // ดึงทั้งหมด
  async getAll(): Promise<SupplierServiceResult> {

    // if (import.meta.env.VITE_USE_MOCK === "true") {
    //   return { ok: true, data: mockSuppliers };
    // }

    try {
      const res = await AxiosUtil.createRequest<SupplierResponse>({
        method: "GET",
        url: "/suppliers",
      });

      if (!res.ok) return { ok: false, message: res.message };
      const list = Array.isArray(res.data.suppliers) ? res.data.suppliers : [];

      return { ok: true, data: list };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  // ดึงตาม ID
  async getById(supplier_id: string): Promise<SupplierServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const supplier = mockSuppliers.find(s => s.supplier_id === supplier_id);
      if (supplier) return { ok: true, data: [supplier] };
      return { ok: false, message: "Supplier not found (mock)" };
    }

    return AxiosUtil.createRequest<SupplierListResponse>({
      method: "GET",
      url: `/suppliers/${supplier_id}`,
    });
  },

  // เพิ่ม Supplier
  async create(
    supplier: Omit<SupplierType, "supplier_id">
  ): Promise<SupplierServiceResult> {
    // if (import.meta.env.VITE_USE_MOCK === "true") {
    //   const newSupplier = {
    //     ...supplier,
    //     supplier_id: crypto.randomUUID(),
    //     create_at: new Date().toISOString(),
    //   };
    //   mockSuppliers.push(newSupplier);
    //   return { ok: true, data: [newSupplier] };
    // }

    try {
      const payload = {
        name: supplier.name,
        phone: supplier.phone,
        address: supplier.address,
        email: supplier.email
      }
      const res = await AxiosUtil.createRequest<SupplierListResponse>({
        method: "POST",
        url: "/suppliers",
        data: payload,
      });

      if (!res.ok) return { ok: false, message: res.message };
      return { ok: true, data: res.data };

    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  // อัปเดต Supplier
  async update(
    supplier_id: string,
    supplier: Partial<SupplierType>
  ): Promise<SupplierServiceResult> {
    // if (import.meta.env.VITE_USE_MOCK === "true") {
    //   const idx = mockSuppliers.findIndex(s => s.supplier_id === supplier_id);
    //   if (idx === -1)
    //     return { ok: false, message: "Supplier not found (mock)" };

    //   mockSuppliers[idx] = { ...mockSuppliers[idx], ...supplier };
    //   return { ok: true, data: [mockSuppliers[idx]] };
    // }

    try {
      const payload = {
        supplier_id: supplier.supplier_id,
        name: supplier.name,
        phone: supplier.phone,
        address: supplier.address,
        email: supplier.email
      }
      const res = await AxiosUtil.createRequest<SupplierListResponse>({
        method: "PUT",
        url: `/suppliers/${supplier_id}`,
        data: payload,
      });

      if (!res.ok) return { ok: false, message: res.message };
      return { ok: true, data: res.data };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  // ลบ Supplier
  async delete(supplier_id: string): Promise<SupplierServiceResult> {
    // if (import.meta.env.VITE_USE_MOCK === "true") {
    //   const idx = mockSuppliers.findIndex(s => s.supplier_id === supplier_id);
    //   if (idx === -1)
    //     return { ok: false, message: "Supplier not found (mock)" };

    //   const deleted = mockSuppliers.splice(idx, 1);
    //   return { ok: true, data: deleted };
    // }

    try {
      const res = await AxiosUtil.createRequest<SupplierListResponse>({
        method: "DELETE",
        url: `/suppliers/${supplier_id}`,
      });

      if (!res.ok) return { ok: false, message: res.message };
      return { ok: true, data: [] };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },
};