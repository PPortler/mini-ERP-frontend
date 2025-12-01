import { useState, useEffect, useCallback } from "react";
import { AuditLogService } from "../../../services/AuditLogService";
import type { AuditLogType } from "../../../types/auditLog";
import { LoadingProvider } from "../../../contexts/LoadingContext";

export const useLoadInitialData = () => {
  const { setOpenLoading } = LoadingProvider.useLoading()
  const [auditLogs, setAuditLogs] = useState<AuditLogType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setOpenLoading(true);
      const res = await AuditLogService.getAll();
      if (res.ok) {
        setAuditLogs(res.data);
        setError(null);
      } else {
        setError(res.message || "Failed to load audit logs");
      }
    } catch (err: unknown) {
      if(err instanceof Error){
        setError(err.message || "Failed to load audit logs");
      }
    } finally {
      setOpenLoading(false);
    }
  }, [setOpenLoading]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return { auditLogs, error, refetch: fetchAuditLogs };
};