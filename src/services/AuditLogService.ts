import { AxiosUtil } from "../utils/AxiosUtil";
import { mockAuditLogs } from "../mocks/mockAuditLogs"; // ไฟล์ mock ที่เราสร้างก่อนหน้านี้
import type { AuditLogType } from "../types/auditLog";
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