export type ProductType = {
    product_id: string,
    name: string,
    cost_price: number,
    selling_price: number,
    min_stock: number,
    unit: number,
    category_id: string,
    stock?: number,
}