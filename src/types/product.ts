import type { CatagoriesType } from "./catagories"

export type ProductType = {
    product_id: string,
    product_code: string,
    name: string,
    cost_price: number,
    selling_price: number,
    min_stock: number,
    unit: string,
    category_id: string,
    stock?: number,
    category?: CatagoriesType | null;
    category_name?: string | null;
}