export type AuditLogType = {
    audit_log_id: string,
    user_id: string,
    action: string,
    user: {
        id: string,
        firstName: string,
        lastName: string,
        role: string
    },
    description?: string,
    created_at?: string,
    detail?: Record<string, unknown> | string;
}