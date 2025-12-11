import type { CatagoriesType } from "./catagories"
import type { FileType } from "./file";

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
    created_at?: string,
    updated_at?: string
    product_image?: FileType
}

export type StockSummaryType = {
    product_id: string;
    current_stock?: number;
    total_in?: number,
    total_out?: number,
    total_adjust?: number,
};

export type ProductStockType = {
    product: ProductType,
    stock_summary: StockSummaryType,
    is_low_stock: boolean,
    created_at?: string,
    updated_at?: string,
    min_stock?: number
}