import { AxiosUtil } from "../utils/AxiosUtil";
import { mockProducts } from "../mocks/mockProducts";
import type { ProductType } from "../types/product";
import { CatagoriesService } from "./CatagoriesService";

export type ProductListResponse = ProductType[];

export type ProductServiceResult =
  | { ok: true; data: ProductListResponse }
  | { ok: false; message: string };

export const ProductService = {
  async getAll(): Promise<ProductServiceResult> {
    //mock
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const categoriesRes = await CatagoriesService.getAll();
      const productsWithCategory = mockProducts.map(p => ({
        ...p,
        category_name: categoriesRes.ok
          ? categoriesRes.data.find(c => c.category_id === p.category_id)?.name || "-"
          : "-",
      }));
      return { ok: true, data: productsWithCategory };
    }
    const productsRes = await AxiosUtil.createRequest<ProductListResponse>({
      method: "GET",
      url: "/products",
    });

    if (!productsRes.ok) return productsRes;
    const categoriesRes = await CatagoriesService.getAll();
    const productsWithCategory = productsRes.data.map(p => ({
      ...p,
      category_name: categoriesRes.ok
        ? categoriesRes.data.find(c => c.category_id === p.category_id)?.name || "-"
        : "-",
    }));

    return { ok: true, data: productsWithCategory };
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
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const newProduct = { ...product, product_id: crypto.randomUUID() };
      mockProducts.push(newProduct);
      return { ok: true, data: [newProduct] };
    }

    return AxiosUtil.createRequest<ProductListResponse>({
      method: "POST",
      url: "/products",
      data: product,
    });
  },

  // แก้ไขสินค้า
  async update(product_id: string, product: Partial<ProductType>): Promise<ProductServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockProducts.findIndex(p => p.product_id === product_id);
      if (idx === -1) return { ok: false, message: "Product not found (mock)" };
      mockProducts[idx] = { ...mockProducts[idx], ...product };
      return { ok: true, data: [mockProducts[idx]] };
    }

    return AxiosUtil.createRequest<ProductListResponse>({
      method: "PUT",
      url: `/products/${product_id}`,
      data: product,
    });
  },

  // ลบสินค้า
  async delete(product_id: string): Promise<ProductServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockProducts.findIndex(p => p.product_id === product_id);
      if (idx === -1) return { ok: false, message: "Product not found (mock)" };
      const deleted = mockProducts.splice(idx, 1);
      return { ok: true, data: deleted };
    }

    return AxiosUtil.createRequest<ProductListResponse>({
      method: "DELETE",
      url: `/products/${product_id}`,
    });
  },
};