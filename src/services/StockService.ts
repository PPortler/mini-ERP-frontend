import { AxiosUtil } from "../utils/AxiosUtil";
import { getMockStockSummary, mockStockTransactions } from "../mocks/mockStockTransaction";
import type { StockTransactionType } from "../types/stockTransection";

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
  | { ok: true; data: StockSummaryType }
  | { ok: false; message: string };


export type StockListResponse = StockTransactionType[];

export type StockServiceResult =
  | { ok: true; data: StockListResponse }
  | { ok: false; message: string };

export const StockService = {
  // ดึง stock transactions ทั้งหมด
  async getAll(): Promise<StockServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      return { ok: true, data: mockStockTransactions };
    }

    return AxiosUtil.createRequest<StockListResponse>({
      method: "GET",
      url: "/stock-transactions",
    });
  },

  // สร้าง transaction ใหม่
  async create(transaction: Omit<StockTransactionType, "stock_transaction_id" | "created_at">): Promise<StockServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      const newTransaction = {
        ...transaction,
        stock_transaction_id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };
      mockStockTransactions.push(newTransaction);
      return { ok: true, data: [newTransaction] };
    }

    return AxiosUtil.createRequest<StockListResponse>({
      method: "POST",
      url: "/stock-transactions",
      data: transaction,
    });
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
  async stockIn(payload: StockInPayload): Promise<StockServiceResult> {
    try {
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
};