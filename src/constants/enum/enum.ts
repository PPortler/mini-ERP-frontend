export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  VIEWER: "viewer",
} as const;

export const ACTIONS = {
  CREATE_PRODUCT: "CREATE_PRODUCT",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  DELETE_PRODUCT: "DELETE_PRODUCT",
  CREATE_CATEGORY: "CREATE_CATEGORY",
  UPDATE_CATEGORY: "UPDATE_CATEGORY",
  DELETE_CATEGORY: "DELETE_CATEGORY",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
} as const;

export const TYPE_STOCK_TRANSECTION = {
  IN: "IN",
  OUT: "OUT",
  ADJUST: "ADJUST"
}

export const STATUS_PO = {
  DRAFT: "DRAFT",
  CONFIRMED: "CONFIRMED",
  RECEIVED: "RECEIVED",
  CANCELLED: "CANCELLED"
}

export const SORT_BY_TYPE = {
  ASC: "asc",
  DESC: "desc"
}

export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1
}

export const SEARCH_CONFIG = {
  DELAY: 500
}

export const CATEGORY_MENU = {
  OVERVIEW: "Overview",
  INVENTORY: "Inventory",
  PURCHASE: "Purchase",
  ADMIN: "Admin"
}

export const AUDIT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "Failed"
}

export const ACTION_METHOD = {
  POST: "POST",
  PUT: "PUT",
  GET: "GET",
  DELETE: "DELETE",
  PATCH: "PATCH"
}