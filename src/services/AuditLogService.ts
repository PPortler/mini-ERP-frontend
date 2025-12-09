import { AxiosUtil } from "../utils/AxiosUtil";
import { mockAuditLogs } from "../mocks/mockAuditLogs"; // ไฟล์ mock ที่เราสร้างก่อนหน้านี้
import type { AuditLogType } from "../types/auditLog";
import type { AuditLogResponse } from "../types/apiResponse";
export type AuditLogListResponse = AuditLogType[];

export type AuditLogServiceResult =
  | { ok: true; data: AuditLogListResponse }
  | { ok: false; message: string };

export const AuditLogService = {
  // ดึง audit logs ทั้งหมด
  async getAll(): Promise<AuditLogServiceResult> {
    if (import.meta.env.VITE_USE_MOCK === "true") {
      return { ok: true, data: mockAuditLogs };
    }

    return AxiosUtil.createRequest<AuditLogListResponse>({
      method: "GET",
      url: "/audit-logs",
    });
  },

  async getByParams(
    page?: number,
    pageSize?: number,
    search?: string,
    sortField?: string,
    sortOrder?: string
  ): Promise<{ ok: true; data: AuditLogResponse } | { ok: false; message: string }> {
    // if (import.meta.env.VITE_USE_MOCK === "true") {
    //   return { ok: true, data: mockAuditLogs };
    // }

    const params = {
      page: page,
      pageSize: pageSize,
      search: search,
      sortField: sortField,
      sortOrder: sortOrder
    }
    try {
      const res = await AxiosUtil.createRequest<AuditLogResponse>({
        method: "GET",
        url: "/audit-logs",
        params,
      });
      if (!res.ok) return { ok: false, message: res.message };
      
      return {
        ok: true, data: res.data,
      };
    } catch (err: unknown) {
      let message = "Error to load data.";
      if (err instanceof Error) {
        message = err.message;
      }
      return { ok: false, message };
    }
  },

  // // ดึง audit log ตาม ID
  // async getById(audit_log_id: string): Promise<AuditLogServiceResult> {
  //   if (import.meta.env.VITE_USE_MOCK === "true") {
  //     const log = mockAuditLogs.find(l => l.audit_log_id === audit_log_id);
  //     if (log) return { ok: true, data: [log] };
  //     return { ok: false, message: "Audit log not found (mock)" };
  //   }

  //   return AxiosUtil.createRequest<AuditLogListResponse>({
  //     method: "GET",
  //     url: `/audit-logs/${audit_log_id}`,
  //   });
  // },

  // // สร้าง audit log ใหม่
  // async create(log: Omit<AuditLogType, "id" | "createdAt">): Promise<AuditLogServiceResult> {
  //   if (import.meta.env.VITE_USE_MOCK === "true") {
  //     const newLog = {
  //       ...log,
  //       id: crypto.randomUUID(),
  //       createdAt: new Date().toISOString(),
  //     };
  //     mockAuditLogs.push(newLog);
  //     return { ok: true, data: [newLog] };
  //   }

  //   return AxiosUtil.createRequest<AuditLogListResponse>({
  //     method: "POST",
  //     url: "/audit-logs",
  //     data: log,
  //   });
  // },

  // // ลบ audit log
  // async delete(audit_log_id: string): Promise<AuditLogServiceResult> {
  //   if (import.meta.env.VITE_USE_MOCK === "true") {
  //     const idx = mockAuditLogs.findIndex(l => l.audit_log_id === audit_log_id);
  //     if (idx === -1) return { ok: false, message: "Audit log not found (mock)" };
  //     const deleted = mockAuditLogs.splice(idx, 1);
  //     return { ok: true, data: deleted };
  //   }

  //   return AxiosUtil.createRequest<AuditLogListResponse>({
  //     method: "DELETE",
  //     url: `/audit-logs/${audit_log_id}`,
  //   });
  // },
};