import { AxiosUtil } from "../utils/AxiosUtil";
import type { CatagoriesType } from "../types/catagories";
import { getMockCategory, mockCatagories } from "../mocks/mockCatagories";
import type { CategoryResponse } from "../types/apiResponse";
import { delay } from "../utils/delay";
// import { delay } from "../utils/delay";

export type CatagoriesListResponse = CatagoriesType[];

export type CatagoriesServiceResult =
  | { ok: true; data?: CatagoriesListResponse }
  | { ok: false; message: string };

export const CatagoriesService = {
  // ดึงหมวดหมู่ทั้งหมด
  async getAll(): Promise<CatagoriesServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      return { ok: true, data: mockCatagories };
    }

    try {
      const res = await AxiosUtil.createRequest<CategoryResponse>({
        method: "GET",
        url: "/categories",
      });

      if (!res.ok) {
        return { ok: false, message: res.message };
      }

      // ป้องกัน backend ส่ง data = undefined / null
      const list = Array.isArray(res.data.categories) ? res.data.categories : [];
      return {
        ok: true,
        data: list,
      };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  async getByPagination(
    page = 1,
    pageSize = 10,
    search = "",
    sortField?: string,
    sortOrder?: string
  ): Promise<{ ok: true; data: CategoryResponse } | { ok: false; message: string }> {

    if (import.meta.env.VITE_USE_MOCK === "true") {
      const data = getMockCategory(page, pageSize, search);
      await delay();
      return { ok: true, data };
    }

    const params = {
      page: page,
      pageSize: pageSize,
      search: search,
      sortField: sortField,
      sortOrder: sortOrder
    }
    try {
      const res = await AxiosUtil.createRequest<CategoryResponse>({
        method: "GET",
        url: "/categories",
        params,
      });
      if (!res.ok) return { ok: false, message: res.message };

      const mappedData: CategoryResponse = {
        ...res.data,
        data: res.data.categories ?? [],
      };

      return {
        ok: true, data: mappedData,
      };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  // ดึงหมวดหมู่ตาม ID
  async getById(category_id: string): Promise<CatagoriesServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const category = mockCatagories.find(c => c.category_id === category_id);
      if (category) return { ok: true, data: [category] };
      return { ok: false, message: "Category not found (mock)" };
    }

    return AxiosUtil.createRequest<CatagoriesListResponse>({
      method: "GET",
      url: `/categories/${category_id}`,
    });
  },

  // เพิ่มหมวดหมู่ใหม่
  async create(category: Omit<CatagoriesType, "category_id">): Promise<CatagoriesServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const newCategory = { ...category, category_id: crypto.randomUUID() };
      mockCatagories.push(newCategory);
      return { ok: true, data: [newCategory] };
    }

    try {
      const payload = {
        name: category.name,
        description: category.description
      }
      const res = await AxiosUtil.createRequest<{ category: CatagoriesType }>({
        method: "POST",
        url: "/categories",
        data: payload,
      });

      if (!res.ok) return { ok: false, message: res.message };

      return { ok: true };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  // แก้ไขหมวดหมู่
  async update(category_id: string, category: Partial<CatagoriesType>): Promise<CatagoriesServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockCatagories.findIndex(c => c.category_id === category_id);
      if (idx === -1) return { ok: false, message: "Category not found (mock)" };
      mockCatagories[idx] = { ...mockCatagories[idx], ...category, updatedAt: new Date() };
      return { ok: true, data: [mockCatagories[idx]] };
    }

    try {
      const payload = {
        name: category.name,
        description: category.description
      }
      const res = await AxiosUtil.createRequest<{ category: CatagoriesType }>({
        method: "PUT",
        url: `/categories/${category_id}`,
        data: payload,
      });

      if (!res.ok) return { ok: false, message: res.message };

      return { ok: true };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  // ลบหมวดหมู่
  async delete(category_id: string): Promise<CatagoriesServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockCatagories.findIndex(c => c.category_id === category_id);
      if (idx === -1) return { ok: false, message: "Category not found (mock)" };
      const deleted = mockCatagories.splice(idx, 1);
      return { ok: true, data: deleted };
    }

    try {
      const res = await AxiosUtil.createRequest<{ category: CatagoriesType }>({
        method: "DELETE",
        url: `/categories/${category_id}`,
      });

      if (!res.ok) return { ok: false, message: res.message };

      return { ok: true };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },
};