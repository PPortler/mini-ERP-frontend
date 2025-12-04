import { AxiosUtil } from "../utils/AxiosUtil";
import type { StockSummaryType, StockMovementType, PurchaseSummaryType } from "../types/reports";
// import { getMockPurchaseSummary, getMockStockMovements, getMockStockSummaryReport } from "../mocks/mockReports";

type ReportServiceResult<T> =
  | { ok: true; data?: T }
  | { ok: false; message: string };

export const ReportService = {
  // Stock Summary Report
  async getStockSummary(): Promise<ReportServiceResult<StockSummaryType>> {
    // if (import.meta.env.VITE_USE_MOCK === "true") {
    //   const mock = getMockStockSummaryReport();
    //   return { ok: true, data: mock };
    // }

    try {
      const res = await AxiosUtil.createRequest({
        method: "GET",
        url: `/reports/stock-summary`,
      });

      if (!res.ok) {
        return { ok: false, message: res.message };
      }

      return { ok: true, data: res.data as StockSummaryType };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาด";

      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  // Stock Movements Report
  async getStockMovements(from: string, to: string): Promise<ReportServiceResult<StockMovementType>> {
    // if (import.meta.env.VITE_USE_MOCK === "true") {
    //   const mock = getMockStockMovements(from, to);
    //   return { ok: true, data: mock };
    // }

    const params = {
      from: from,
      to: to
    }
    try {
      const res = await AxiosUtil.createRequest({
        method: "GET",
        url: `/reports/stock-movements`,
        params: params
      });

      if (!res.ok) {
        return { ok: false, message: res.message };
      }
      return { ok: true, data: res.data as StockMovementType };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาด";

      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  // Purchasing Summary Report
  async getPurchaseSummary(month: string): Promise<ReportServiceResult<PurchaseSummaryType>> {
    // if (import.meta.env.VITE_USE_MOCK === "true") {
    //   const mock = getMockPurchaseSummary(month);
    //   return { ok: true, data: mock };
    // }

    const params = {
      month: month
    }
    try {
      const res = await AxiosUtil.createRequest({
        method: "GET",
        url: `/reports/purchase-summary`,
        params: params
      });

      if (!res.ok) {
        return { ok: false, message: res.message };
      }

      return { ok: true, data: res.data as PurchaseSummaryType };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาด";

      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  //export stock-summary to csv
  async getStockSummaryExportToCsv(): Promise<ReportServiceResult<PurchaseSummaryType>> {
    try {
      const res = await AxiosUtil.createRequest({
        method: "GET",
        url: `/reports/stock-summary/export`,
        responseType: "blob",

      });

      if (!res.ok) {
        return { ok: false, message: res.message };
      }
      const url = window.URL.createObjectURL(new Blob([res.data as BlobPart]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `stock_summary.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { ok: true };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาด";

      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  //export stock movement to excel
  async getStockMovementExportToExcel(from: string, to: string): Promise<ReportServiceResult<StockMovementType>> {
    const params = {
      from: from,
      to: to
    }
    try {
      const res = await AxiosUtil.createRequest({
        method: "GET",
        url: `/reports/stock-movements/export`,
        params: params,
        responseType: "blob",
      });
      if (!res.ok) {
        return { ok: false, message: res.message };
      }
      const url = window.URL.createObjectURL(new Blob([res.data as BlobPart]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `stock-movement-${from}_${to}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { ok: true };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาด";

      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  //export po-summary to excel
  async getPurchaseSummaryExportToExcel(month: string): Promise<ReportServiceResult<PurchaseSummaryType>> {
    // if (import.meta.env.VITE_USE_MOCK === "true") {
    //   const mock = getMockPurchaseSummary(month);
    //   return { ok: true, data: mock };
    // }
    const params = {
      month: month
    }
    try {
      const res = await AxiosUtil.createRequest({
        method: "GET",
        url: `/reports/purchase-summary/export`,
        params: params
      });
      if (!res.ok) {
        return { ok: false, message: res.message };
      }
      const url = window.URL.createObjectURL(new Blob([res.data as BlobPart]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `purchase-summary-${month}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { ok: true, data: res.data as PurchaseSummaryType };
    } catch (err: unknown) {
      let message = "เกิดข้อผิดพลาด";

      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },


};