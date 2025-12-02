import type { CatagoriesType } from "./catagories";
import type { ProductType } from "./product";
import type { PurchaseOrderType } from "./purchaes";

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
  purchaseOrders?: PurchaseOrderType[];
};
