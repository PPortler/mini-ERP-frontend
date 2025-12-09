import type { UserInfoType } from "./user";

export type AuditLogType = {
    audit_log_id: string,
    user_id: string,
    action: string,
    path?: string,
    user?: UserInfoType,
    username?: string,
    status: string,
    description?: string,
    created_at?: string,
    detail?: Record<string, unknown> | string;
}