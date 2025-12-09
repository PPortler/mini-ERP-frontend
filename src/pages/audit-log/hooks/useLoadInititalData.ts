import { useState, useEffect, useCallback } from "react";
import { AuditLogService } from "../../../services/AuditLogService";
import type { AuditLogType } from "../../../types/auditLog";
import { TABLE_CONFIG } from "../../../constants/enum/enum";
import { useSearchParams } from "react-router-dom";
import { useSyncStateWithSearchParams } from "../../../hooks/useSyncStateWithSearchParams";
import type { UserInfoType } from "../../../types/user";
import { UserService } from "../../../services/UserService";

export const useLoadInitialData = () => {
  const [searchParams] = useSearchParams();

  const initialPage = parseInt(searchParams.get("page") || TABLE_CONFIG.DEFAULT_PAGE.toString());
  const initialPageSize = parseInt(searchParams.get("pageSize") || TABLE_CONFIG.DEFAULT_PAGE_SIZE.toString());
  const initialAction = searchParams.get("action") || "";
  const initialUserId = searchParams.get("usesId") || "";
  const initialDate = searchParams.get("date") || "";

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [action, setAction] = useState(initialAction);
  const [userId, setUserId] = useState(initialUserId);
  const [date, setDate] = useState(initialDate);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState<boolean>(false)
  const [auditLogs, setAuditLogs] = useState<AuditLogType[]>([]);
  const [users, setUsers] = useState<UserInfoType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useSyncStateWithSearchParams({
    page,
    pageSize,
    action,
    userId,
    date
  });

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      const [resAudit, resUser] = await Promise.all([
        AuditLogService.getByParams(page, pageSize, action, userId, date),
        UserService.getAll(),
      ]);

      if (!resAudit.ok) throw new Error(resAudit.message || "Failed to load");
      if (!resUser.ok) throw new Error(resUser.message || "Failed to load");

      if ((resAudit.data.data && resAudit.data.data.length <= 0) || pageSize <= 0) {
        setPage(TABLE_CONFIG.DEFAULT_PAGE)
        setPageSize(TABLE_CONFIG.DEFAULT_PAGE_SIZE)
      }

      setAuditLogs(resAudit.data.Items || []);
      setUsers(resUser.data || []);
      setTotal(resAudit.data.Total || 0)
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to load audit logs");
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, action, userId, date]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return {
    auditLogs,
    error,
    refetch: fetchAuditLogs,
    loading,
    page,
    pageSize,
    setPage,
    setPageSize,
    date,
    action,
    userId,
    setUserId,
    setDate,
    setAction,
    users,
    setTotal,
    total
  };
};