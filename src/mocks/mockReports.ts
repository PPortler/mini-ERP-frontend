import { mockProducts } from "./mockProducts";
import { mockPurchaseOrders } from "./mockPurchase";
import { mockStockTransactions } from "./mockStockTransaction";
import { mockSuppliers } from "./mockSuppliers";
import { calcStockSummary } from "./utils/calcStockSummary";

export const getMockStockMovements = (from?: string, to?: string) => {
  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  return mockStockTransactions.filter((t) => {
    const created = new Date(t.created_at ?? "");

    if (fromDate && created < fromDate) return false;
    if (toDate && created > toDate) return false;

    return true;
  });
};

export const getMockStockSummaryReport = (from?: string, to?: string) => {
  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  return mockProducts.map((p) => {
    const tx = mockStockTransactions.filter((t) => {
      if (t.product_id !== p.product_id) return false;

 const created = new Date(t.created_at ?? "");
      if (fromDate && created < fromDate) return false;
      if (toDate && created > toDate) return false;

      return true;
    });

    const summary = calcStockSummary(tx);

    return {
      product_id: p.product_id,
      name: p.name,
      current_stock: summary.current_stock,
      cost_value: summary.current_stock * p.cost_price,
      selling_value: summary.current_stock * p.selling_price,
    };
  });
};

export const getMockPurchaseSummary = (month?: string) => {

  const poInMonth = mockPurchaseOrders.filter((po) => {
    if (!month) return true; // เอาทุก PO
    return po.create_at?.slice(0, 7) === month;
  });

  // สร้าง row สำหรับ DataTable
  const rows = poInMonth.map((po) => {
    const supplier = mockSuppliers.find((s) => s.supplier_id === po.supplier_id);

    return {
      purchase_order_id: po.purchase_order_id,
      supplier_name: supplier?.name || po.supplier_id,
      status: po.status,
      total_amount: po.total_amount,
      create_at: po.create_at,
    };
  });

  return rows;
};