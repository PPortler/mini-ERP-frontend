import { TYPE_STOCK_TRANSECTION } from "../../constants/enum/enum";
import type { StockTransactionType } from "../../types/stockTransection";

export const calcStockSummary = (transactions: StockTransactionType[]) => {
  const stockIn = transactions
    .filter((t) => t.type === TYPE_STOCK_TRANSECTION.IN)
    .reduce((sum, t) => sum + t.quantity, 0);

  const stockOut = transactions
    .filter((t) => t.type === TYPE_STOCK_TRANSECTION.OUT)
    .reduce((sum, t) => sum + t.quantity, 0);

  const stockAdjust = transactions
    .filter((t) => t.type === TYPE_STOCK_TRANSECTION.ADJUST)
    .reduce((sum, t) => sum + t.quantity, 0);

  const currentStock = stockIn - stockOut + stockAdjust;

  return {
    stock_in: stockIn,
    stock_out: stockOut,
    stock_adjust: stockAdjust,
    current_stock: currentStock,
  };
};