import type { ProductType } from "./product";

// ==================== Purchase Summary ====================
export type PurchaseSummaryItemType = {
  average_amount: number;
  status: string;
  total_amount: number;
  total_orders: number;
};

export type PurchaseSummaryType = {
  received_amount: number;
  received_orders: number;
  summary: PurchaseSummaryItemType[];
  total_amount: number;
  total_orders: number;
};

// ==================== Stock Movement ====================
export type StockMovementItemType = {
  category_name: string;
  created_at: string;
  created_by: string;
  product_code: string;
  product_id: string;
  product_name: string;
  quantity: number;
  reason: string;
  reference_id: string;
  stock_transaction_id: string;
  type: string; // เช่น IN, OUT, ADJUST
};

export type StockMovementType = {
  movements: StockMovementItemType[];
};

// ==================== Stock Summary ====================
export type StockSummaryProductType  = ProductType &{
  is_low_stock: boolean;
  selling_price: number;
  stock_on_hand: number;
  total_cost_value: number;
  total_selling_value: number;
};

export type StockSummaryType = {
  low_stock: StockSummaryProductType[];
  low_stock_count: number;
  products: StockSummaryProductType[];
  total_cost_value: number;
  total_selling_value: number;
  total_stock_on_hand: number;
};