import { AxiosUtil } from "../utils/AxiosUtil";
import { getMockStockSummaryReport } from "../mocks/mockReports";
import { getMockStockMovements } from "../mocks/mockReports";
import { getMockPurchaseSummary } from "../mocks/mockReports";

export const ReportService = {

  // Stock Summary Report
  async getStockSummary(from?: string, to?: string) {
    try {
      if (import.meta.env.VITE_USE_MOCK === "true") {
        const mock = getMockStockSummaryReport(from, to);
        return { ok: true, data: mock };
      }

      const res = await AxiosUtil.createRequest({
        method: "GET",
        url: `/reports/stock-movements?from=${from || ""}&to=${to || ""}`,
      });

      return { ok: true, data: res.data };
    } catch (err: any) {
      return {
        ok: false,
        message: err?.message || "Failed to load stock summary report",
      };
    }
  },

  // Stock Movements Report
  async getStockMovements(from?: string, to?: string) {
    try {
      if (import.meta.env.VITE_USE_MOCK === "true") {
        const mock = getMockStockMovements(from, to);
        return { ok: true, data: mock };
      }

      const res = await AxiosUtil.createRequest({
        method: "GET",
        url: `/reports/stock-movements?from=${from || ""}&to=${to || ""}`,
      });

      return { ok: true, data: res.data };
    } catch (err: any) {
      return {
        ok: false,
        message: err?.message || "Failed to load stock movement report",
      };
    }
  },

  // Purchasing Summary Report
  async getPurchaseSummary(month?: string) {
    try {
      if (import.meta.env.VITE_USE_MOCK === "true") {
        const mock = getMockPurchaseSummary(month);
        return { ok: true, data: mock };
      }

      const res = await AxiosUtil.createRequest({
        method: "GET",
        url: `/reports/purchase-summary?month=${month || ""}`,
      });

      return { ok: true, data: res.data };
    } catch (err: any) {
      return {
        ok: false,
        message: err?.message || "Failed to load purchase summary report",
      };
    }
  },
};