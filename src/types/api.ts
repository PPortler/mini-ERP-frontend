import type { CatagoriesType } from "./catagories";
import type { ProductType } from "./product";

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
