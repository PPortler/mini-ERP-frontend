import { ROLES, ACTIONS } from "../constants/enum/enum";
import type { AuditLogType } from "../types/auditLog";

export const mockAuditLogs: AuditLogType[] = [
  {
    audit_log_id: "1",
    user_id: "u001",
    action: ACTIONS.LOGIN,
    user: {
      id: "u001",
      firstName: "Admin",
      lastName: "User",
      role: ROLES.ADMIN,
    },
    description: "User logged in successfully.",
    created_at: "2025-01-15T08:45:12.000Z",
    detail: {
      ipAddress: "192.168.1.10",
      userAgent: "Chrome on macOS",
    },
  },
  {
    audit_log_id: "2",
    user_id: "u002",
    action: ACTIONS.UPDATE_PRODUCT,
    user: {
      id: "u002",
      firstName: "Somchai",
      lastName: "Owner",
      role: ROLES.VIEWER,
    },
    description: "Updated product 'Som Tam Thai' price 65 → 70",
    created_at: "2025-02-03T14:22:55.000Z",
    detail: {
      productId: "prod_101",
      oldPrice: 65,
      newPrice: 70,
      ipAddress: "192.168.1.11",
      userAgent: "Safari on iPhone",
    },
  },
  {
    audit_log_id: "3",
    user_id: "u002",
    action: ACTIONS.DELETE_CATEGORY,
    user: {
      id: "u002",
      firstName: "Somchai",
      lastName: "Owner",
      role: ROLES.STAFF,
    },
    description: "Deleted category ID: cat_103",
    created_at: "2025-02-03T14:25:40.000Z",
    detail: {
      categoryId: "cat_103",
      ipAddress: "192.168.1.11",
      userAgent: "Safari on iPhone",
    },
  },
  {
    audit_log_id: "4",
    user_id: "u003",
    action: ACTIONS.CREATE_PRODUCT,
    user: {
      id: "u003",
      firstName: "Staff",
      lastName: "A",
      role: ROLES.VIEWER,
    },
    description: "Added new product 'Khao Niao 10 THB'",
    created_at: "2025-02-20T10:18:09.000Z",
    detail: {
      productId: "prod_105",
      price: 10,
      ipAddress: "192.168.1.50",
      userAgent: "Chrome on Windows",
    },
  },
  {
    audit_log_id: "5",
    user_id: "u001",
    action: ACTIONS.LOGOUT,
    user: {
      id: "u001",
      firstName: "Admin",
      lastName: "User",
      role: ROLES.ADMIN,
    },
    description: "User logged out.",
    created_at: "2025-02-21T19:55:03.000Z",
    detail: {
      ipAddress: "192.168.1.10",
      userAgent: "Chrome on macOS",
    },
  },
];