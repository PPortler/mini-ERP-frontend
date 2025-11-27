import { AxiosUtil } from "../utils/AxiosUtil";
import { mockPurchaseOrders } from "../mocks/mockPurchase";
import type { PurchaseOrderType } from "../types/purchaes";

export type StockSummaryReportType = {
  product_id: string;
  stock_on_hand: number;
  cost_value: number;
  selling_value: number;
};

export type StockMovementReportType = {
  stock_transaction_id: string;
  product_id: string;
  name: string;
  type: string;
  quantity: number;
  reason?: string;
  reference?: string;
  created_at: string;
};

export type PurchaseSummaryReportType = PurchaseOrderType & {
  month?: string;
};

export type ReportServiceResult<T> =
  | { ok: true; data: T[] }
  | { ok: false; message: string };

export const ReportService = {
  // =================== Purchase Summary ===================
  async getPurchaseSummary(
    month?: string
  ): Promise<ReportServiceResult<PurchaseSummaryReportType>> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      // mock data
      let data: PurchaseSummaryReportType[] = mockPurchaseOrders;

      if (month) {
        data = data.filter((po) => po.month === month);
      }
      return { ok: true, data };
    }

    return AxiosUtil.createRequest<PurchaseSummaryReportType[]>({
      method: "GET",
      url: `/reports/purchase-summary?month=${month || ""}`,
    });
  },
};