import { AxiosUtil } from "../utils/AxiosUtil";
import type { CatagoriesType } from "../types/catagories";
import { getMockCategory, mockCatagories } from "../mocks/mockCatagories";
import type { CategoryResponse } from "../types/apiResponse";

export type CatagoriesListResponse = CatagoriesType[];

export type CatagoriesServiceResult =
  | { ok: true; data: CatagoriesListResponse }
  | { ok: false; message: string };

export const CatagoriesService = {
  // ดึงหมวดหมู่ทั้งหมด
  async getAll(): Promise<CatagoriesServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      return { ok: true, data: mockCatagories };
    }

    return AxiosUtil.createRequest<CatagoriesListResponse>({
      method: "GET",
      url: "/categories",
    });
  },

  async getByPagination(
    page = 1,
    pageSize = 10,
    search = "",
  ): Promise<{ ok: true; data: CategoryResponse } | { ok: false; message: string }> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const data = getMockCategory(page, pageSize, search)
      return { ok: true, data: data };
    }

    const params = {
      page: page,
      pageSize: pageSize,
      search: search,
    }
    try {
      const res = await AxiosUtil.createRequest<CategoryResponse>({
        method: "GET",
        url: "/categories",
        params,
      });
      if (!res.ok) return { ok: false, message: res.message };
      return { ok: true, data: res.data };
    } catch (err: any) {
      return { ok: false, message: err.message };
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

    return AxiosUtil.createRequest<CatagoriesListResponse>({
      method: "POST",
      url: "/categories",
      data: category,
    });
  },

  // แก้ไขหมวดหมู่
  async update(category_id: string, category: Partial<CatagoriesType>): Promise<CatagoriesServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockCatagories.findIndex(c => c.category_id === category_id);
      if (idx === -1) return { ok: false, message: "Category not found (mock)" };
      mockCatagories[idx] = { ...mockCatagories[idx], ...category, updatedAt: new Date() };
      return { ok: true, data: [mockCatagories[idx]] };
    }

    return AxiosUtil.createRequest<CatagoriesListResponse>({
      method: "PUT",
      url: `/categories/${category_id}`,
      data: category,
    });
  },

  // ลบหมวดหมู่
  async delete(category_id: string): Promise<CatagoriesServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockCatagories.findIndex(c => c.category_id === category_id);
      if (idx === -1) return { ok: false, message: "Category not found (mock)" };
      const deleted = mockCatagories.splice(idx, 1);
      return { ok: true, data: deleted };
    }

    return AxiosUtil.createRequest<CatagoriesListResponse>({
      method: "DELETE",
      url: `/categories/${category_id}`,
    });
  },
};