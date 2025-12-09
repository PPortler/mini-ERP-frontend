import type { AuditLogType } from "./auditLog";
import type { CatagoriesType } from "./catagories";
import type { ProductType } from "./product";
import type { PurchaseOrderType } from "./purchaes";
import type { StockTransactionType } from "./stockTransection";
import type { SupplierType } from "./suppliers";
import type { UserInfoType } from "./user";

export interface ApiPaginationResponse<T> {
  data: T;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ProductResponse = ApiPaginationResponse<ProductType[]> & {
  products?: ProductType[]
};
export type CategoryResponse = ApiPaginationResponse<CatagoriesType[]> & {
  categories?: CatagoriesType[];
};
export type PurchaseOrderResponse = ApiPaginationResponse<PurchaseOrderType[]> & {
  purchase_orders?: PurchaseOrderType[];
};
export type PurchaseOrderResponseSingle = ApiPaginationResponse<PurchaseOrderType[]> & {
  purchase_order?: PurchaseOrderType;
};
export type SupplierResponse = ApiPaginationResponse<SupplierType[]> & {
  suppliers?: SupplierType[];
};
export type StockTransactionResponse = ApiPaginationResponse<StockTransactionType[]> & {
  stocks?: StockTransactionType[]
};
export type UserResponse = ApiPaginationResponse<UserInfoType[]> & {
  users?: UserInfoType[]
};
export type AuditLogResponse = ApiPaginationResponse<AuditLogType[]> & {
  Items?: AuditLogType[]
};
