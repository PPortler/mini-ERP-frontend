export type StockTransactionType = {
    stock_transaction_id: string,
    product_id: string,
    type: string,
    quantity: number,
    reason?: string,
    reference?: string,
    created_at?: string,
}