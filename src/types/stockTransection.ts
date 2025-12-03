import type { ProductType } from "./product"

export type StockTransactionType = {
    stock_transaction_id: string,
    product_id: string,
    type: string,
    quantity: number,
    reason?: string,
    reference?: string,
    created_at?: string,
    products?: ProductType
    product?: ProductType // บางตัวใช้อันนี้ของหลังบ้าน
    created_by?: string
    reference_id?: string
}