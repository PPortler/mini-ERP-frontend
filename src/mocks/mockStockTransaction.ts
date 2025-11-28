import type { StockTransactionType } from "../services/StockService";
import { calcStockSummary } from "./utils/calcStockSummary";

export const mockStockTransactions: StockTransactionType[] = [
  {
    stock_transaction_id: "t001",
    product_id: "1a2b3c4d-0001",
    type: "IN",
    quantity: 50,
    created_at: "2025-10-01T08:00:00.000Z",
    reason: "รับสินค้าจาก supplier",
    reference: "PO-001",
  },
  {
    stock_transaction_id: "t002",
    product_id: "1a2b3c4d-0001",
    type: "OUT",
    quantity: 20,
    created_at: "2025-10-02T09:00:00.000Z",
    reason: "ขายสินค้าให้ลูกค้า",
    reference: "INV-001",
  },
  {
    stock_transaction_id: "t003",
    product_id: "1a2b3c4d-0001",
    type: "ADJUST",
    quantity: -7,
    created_at: "2025-10-03T10:00:00.000Z",
    reason: "ของเสีย",
    reference: "ADJ-001",
  },
  {
    stock_transaction_id: "t004",
    product_id: "1a2b3c4d-0002",
    type: "IN",
    quantity: 30,
    created_at: "2025-10-01T08:30:00.000Z",
    reason: "รับสินค้าจาก supplier",
    reference: "PO-002",
  },
  {
    stock_transaction_id: "t005",
    product_id: "1a2b3c4d-0002",
    type: "OUT",
    quantity: 8,
    created_at: "2025-10-02T11:00:00.000Z",
    reason: "ขายสินค้าให้ลูกค้า",
    reference: "INV-002",
  },
];


export const getMockStockSummary = (productId: string) => {
  const transactions = mockStockTransactions.filter(t => t.product_id === productId);

  const summary = calcStockSummary(transactions);

  return {
    product_id: productId,
    ...summary,
  };
};