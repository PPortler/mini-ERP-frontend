import { AxiosUtil } from "../utils/AxiosUtil";
import { getMockStockSummary, mockStockTransactions } from "../mocks/mockStockTransaction";
import type { StockTransactionType } from "../types/stockTransection";
import type { StockTransactionResponse } from "../types/apiResponse";

export interface StockInPayload {
  product_id: string;
  quantity: number;
  reason?: string;
  reference_id?: string;
  created_by: string;
}

export type StockSummaryType = {
  product_id: string;
  current_stock?: number;
  total_in?: number,
  total_out?: number,
  total_adjust?: number,
};

export type StockSummaryServiceResult =
  | { ok: true; data: StockSummaryType, message?: string }
  | { ok: false; message: string };


export type StockListResponse = StockTransactionType[];

export type StockServiceResult =
  | { ok: true; data: StockListResponse }
  | { ok: false; message: string };

export const StockService = {
  async getByPagination(
    page = 1,
    pageSize = 10,
    search = "",
    productId?: string,
    sortBy?: string,
    sortOrder?: string
  ): Promise<{ ok: true; data: StockTransactionResponse } | { ok: false; message: string }> {
    const params = {
      page: page,
      pageSize: pageSize,
      search: search,
      sortBy: sortBy,
      sortOrder: sortOrder,
      ...(productId ? { productId } : {})
    }
    try {
      const res = await AxiosUtil.createRequest<StockTransactionResponse>({
        method: "GET",
        url: "/stocks",
        params,
      });
      if (!res.ok) return { ok: false, message: res.message };

      const mappedStocks = (res.data.stocks ?? []).map((p) => ({
        ...p,
        product_name: p.product?.name || "-",
        product_code: p.product?.product_code || "-"
      }));

      const mappedData: StockTransactionResponse = {
        ...res.data,
        data: mappedStocks,
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

  // ลบ transaction (option)
  async delete(stock_transaction_id: string): Promise<StockServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const idx = mockStockTransactions.findIndex(t => t.stock_transaction_id === stock_transaction_id);
      if (idx === -1) return { ok: false, message: "Stock transaction not found (mock)" };
      const deleted = mockStockTransactions.splice(idx, 1);
      return { ok: true, data: deleted };
    }

    return AxiosUtil.createRequest<StockListResponse>({
      method: "DELETE",
      url: `/stock-transactions/${stock_transaction_id}`,
    });
  },

  // for get summary
  async getStockSummary(product_id: string): Promise<StockSummaryServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const stockSummary = getMockStockSummary(product_id);
      return { ok: true, data: stockSummary };
    }

    const params = {
      product_id: product_id
    }
    try {
      const res = await AxiosUtil.createRequest<StockSummaryType>({
        method: "GET",
        url: `/products/${product_id}/stock-summary`,
        params,
      });
      if (!res.ok) return { ok: false, message: res.message };
      return { ok: true, data: res.data };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาด";

      if (err instanceof Error) {
        message = err.message;
      }

      return { ok: false, message };
    }

  },

  async stockIn(pd: StockTransactionType): Promise<StockServiceResult> {
    try {
      const payload = {
        created_by: pd.created_by,
        product_id: pd.product_id,
        quantity: Number(pd.quantity),
        reason: pd.reason,
        reference_id: pd.reference_id
      }

      const res = await AxiosUtil.createRequest({
        method: 'POST',
        url: '/stocks/in',
        data: payload,
      });

      if (!res.ok) return { ok: false, message: res.message };

      return { ok: true, data: res.data as StockListResponse };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาด";

      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  async stockOut(pd: StockTransactionType): Promise<StockServiceResult> {
    try {
      const payload = {
        product_id: pd.product_id,
        quantity: Number(pd.quantity),
        reason: pd.reason,
        created_by: pd.created_by,
      }

      const res = await AxiosUtil.createRequest({
        method: 'POST',
        url: '/stocks/out',
        data: payload,
      });

      if (!res.ok) return { ok: false, message: res.message };

      return { ok: true, data: res.data as StockListResponse };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาด";

      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  async stockAdjust(pd: StockTransactionType): Promise<StockServiceResult> {
    try {
      const payload = {
        created_by: pd.created_by,
        product_id: pd.product_id,
        quantity: Number(pd.quantity),
        reason: pd.reason,
      }

      const res = await AxiosUtil.createRequest({
        method: 'POST',
        url: '/stocks/adjust',
        data: payload,
      });

      if (!res.ok) return { ok: false, message: res.message };

      return { ok: true, data: res.data as StockListResponse };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาด";

      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },
};