import { useState, useEffect, useCallback } from "react";
import { AuditLogService } from "../../../services/AuditLogService";
import type { AuditLogType } from "../../../types/auditLog";

export const useLoadInitialData = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await AuditLogService.getAll();
      if (res.ok) {
        setAuditLogs(res.data);
        setError(null);
      } else {
        setError(res.message || "Failed to load audit logs");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return { auditLogs, loading, error, refetch: fetchAuditLogs };
};