import { AxiosUtil } from "../utils/AxiosUtil";
import { mockStockTransactions } from "../mocks/mockStockTransaction";
import { TYPE_STOCK_TRANSECTION } from "../constants/enum/enum";

export type StockSummaryType = {
  product_id: string;
  stock?: number;
};

export type StockSummaryServiceResult =
  | { ok: true; data: StockSummaryType }
  | { ok: false; message: string };

export type StockTransactionType = {
  stock_transaction_id: string;
  product_id: string;
  type: string;
  quantity: number;
  reason?: string;
  reference?: string;
  created_at?: string;
};

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
  async get(product_id: string): Promise<StockSummaryServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      // คำนวณ mock summary
      const transactions = mockStockTransactions.filter(t => t.product_id === product_id);
      const stock =
        transactions
          .filter(t => t.type === TYPE_STOCK_TRANSECTION.IN)
          .reduce((sum, t) => sum + t.quantity, 0) -
        transactions
          .filter(t => t.type === TYPE_STOCK_TRANSECTION.OUT)
          .reduce((sum, t) => sum + t.quantity, 0) +
        transactions
          .filter(t => t.type === TYPE_STOCK_TRANSECTION.ADJUST)
          .reduce((sum, t) => sum + t.quantity, 0);

      return { ok: true, data: { product_id, stock } };
    }

    return AxiosUtil.createRequest<StockSummaryType>({
      method: "GET",
      url: `/products/${product_id}/stock-summary`,
    });
  },
};