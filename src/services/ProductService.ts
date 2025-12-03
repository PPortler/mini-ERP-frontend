import { AxiosUtil } from "../utils/AxiosUtil";
import { mockProducts } from "../mocks/mockProducts";
import type { ProductType } from "../types/product";
import type { ProductResponse } from "../types/apiResponse";
// import { delay } from "../utils/delay";
// import { CatagoriesService } from "./CatagoriesService";
// import { mapProductsWithCategory } from "../utils/mapProductWithCategory";

export type ProductListResponse = ProductType[];

export type ProductServiceResult =
  | { ok: true; data?: ProductListResponse }
  | { ok: false; message: string };

export const ProductService = {
  async getAll(): Promise<ProductServiceResult> {
    // if (import.meta.env.VITE_USE_MOCK === "true") {
    //   return { ok: true, data: mockProducts };
    // }

    try {
      const res = await AxiosUtil.createRequest<ProductResponse>({
        method: "GET",
        url: "/products",
      });
      if (!res.ok) {
        return { ok: false, message: res.message };
      }
    
      return {
        ok: true,
        data: res.data.products,
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
    categoryId?: string,
    sortBy?: string,
    sortOrder?: string
  ): Promise<{ ok: true; data: ProductResponse } | { ok: false; message: string }> {
    // ใช้ mock
    // if (import.meta.env.VITE_USE_MOCK === "true") {
    //   const data = getMockProducts(page, pageSize, search, categoryId);
    //   await delay();
    //   return { ok: true, data };
    // }

    // เรียก backend จริง
    const params = {
      page: page,
      pageSize: pageSize,
      search: search,
      sortBy: sortBy,
      sortOrder: sortOrder,
      ...(categoryId ? { categoryId } : {})
    }
    try {
      const res = await AxiosUtil.createRequest<ProductResponse>({
        method: "GET",
        url: "/products",
        params,
      });
      if (!res.ok) return { ok: false, message: res.message };

      const mappedProducts = (res.data.products ?? []).map((p) => ({
        ...p,
        category_name: p.category?.name || "-",
      }));

      const mappedData: ProductResponse = {
        ...res.data,
        data: mappedProducts,
      };

      return { ok: true, data: mappedData };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  // ดึงสินค้าตาม ID
  async getById(product_id: string): Promise<ProductServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const product = mockProducts.find(p => p.product_id === product_id);
      if (product) return { ok: true, data: [product] };
      return { ok: false, message: "Product not found (mock)" };
    }

    return AxiosUtil.createRequest<ProductListResponse>({
      method: "GET",
      url: `/products/${product_id}`,
    });
  },

  // เพิ่มสินค้าใหม่
  async create(product: Omit<ProductType, "product_id">): Promise<ProductServiceResult> {
    // if (import.meta.env.VITE_USE_MOCK === "true") {
    //   const newProduct = { ...product, product_id: crypto.randomUUID() };
    //   mockProducts.push(newProduct);
    //   return { ok: true, data: [newProduct] };
    // }

    try {
      const payload = {
        product_code: product.product_code,
        name: product.name,
        cost_price: Number(product.cost_price),
        selling_price: Number(product.selling_price),
        unit: product.unit,
        min_stock: Number(product.min_stock),
        category_id: product.category_id
      };

      const res = await AxiosUtil.createRequest<{ product: ProductType }>({
        method: "POST",
        url: "/products",
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

  // แก้ไขสินค้า
  async update(product_id: string, product: Partial<ProductType>): Promise<ProductServiceResult> {
    // if (import.meta.env.VITE_USE_MOCK === "true") {
    //   const idx = mockProducts.findIndex(p => p.product_id === product_id);
    //   if (idx === -1) return { ok: false, message: "Product not found (mock)" };
    //   mockProducts[idx] = { ...mockProducts[idx], ...product };
    //   return { ok: true, data: [mockProducts[idx]] };
    // }
    try {
      const payload = {
        product_code: product.product_code,
        name: product.name,
        cost_price: product.cost_price,
        selling_price: product.selling_price,
        unit: product.unit,
        min_stock: product.min_stock,
      };

      const res = await AxiosUtil.createRequest<{ product: ProductType }>({
        method: "PUT",
        url: `/products/${product_id}`,
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

  // ลบสินค้า
  async delete(product_id: string): Promise<ProductServiceResult> {
    // if (import.meta.env.VITE_USE_MOCK === "true") {
    //   const idx = mockProducts.findIndex(p => p.product_id === product_id);
    //   if (idx === -1) return { ok: false, message: "Product not found (mock)" };
    //   const deleted = mockProducts.splice(idx, 1);
    //   return { ok: true, data: deleted };
    // }
    try {

      const res = await AxiosUtil.createRequest<ProductListResponse>({
        method: "DELETE",
        url: `/products/${product_id}`,
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