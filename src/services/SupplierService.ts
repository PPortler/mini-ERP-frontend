import { AxiosUtil } from "../utils/AxiosUtil";
import { mockSuppliers } from "../mocks/mockSuppliers";
import type { SupplierType } from "../types/suppliers";

export type SupplierListResponse = SupplierType[];

export type SupplierServiceResult =
  | { ok: true; data: SupplierListResponse }
  | { ok: false; message: string };

export const SupplierService = {
  // ดึงทั้งหมด
  async getAll(): Promise<SupplierServiceResult> {
    try {
      if (import.meta.env.VITE_USE_MOCK === "true") {
        return { ok: true, data: mockSuppliers };
      }

      const res = await AxiosUtil.createRequest<SupplierListResponse>({
        method: "GET",
        url: "/suppliers",
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
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const newSupplier = {
        ...supplier,
        supplier_id: crypto.randomUUID(),
        create_at: new Date().toISOString(),
      };
      mockSuppliers.push(newSupplier);
      return { ok: true, data: [newSupplier] };
    }

    return AxiosUtil.createRequest<SupplierListResponse>({
      method: "POST",
      url: "/suppliers",
      data: supplier,
    });
  },

  // อัปเดต Supplier
  async update(
    supplier_id: string,
    supplier: Partial<SupplierType>
  ): Promise<SupplierServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockSuppliers.findIndex(s => s.supplier_id === supplier_id);
      if (idx === -1)
        return { ok: false, message: "Supplier not found (mock)" };

      mockSuppliers[idx] = { ...mockSuppliers[idx], ...supplier };
      return { ok: true, data: [mockSuppliers[idx]] };
    }

    return AxiosUtil.createRequest<SupplierListResponse>({
      method: "PUT",
      url: `/suppliers/${supplier_id}`,
      data: supplier,
    });
  },

  // ลบ Supplier
  async delete(supplier_id: string): Promise<SupplierServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockSuppliers.findIndex(s => s.supplier_id === supplier_id);
      if (idx === -1)
        return { ok: false, message: "Supplier not found (mock)" };

      const deleted = mockSuppliers.splice(idx, 1);
      return { ok: true, data: deleted };
    }

    return AxiosUtil.createRequest<SupplierListResponse>({
      method: "DELETE",
      url: `/suppliers/${supplier_id}`,
    });
  },
};