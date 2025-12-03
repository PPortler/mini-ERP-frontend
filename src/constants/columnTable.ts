import type { Column } from "../components/Table/DataTable";
import type { AuditLogType } from "../types/auditLog";
import type { CatagoriesType } from "../types/catagories";
import type { ProductType } from "../types/product";
import type { SupplierType } from "../types/suppliers";

export const columnProducts: Column<ProductType>[] = [
  { header: "รหัสสินค้า", accessor: "product_code" },
  { header: "สินค้า", accessor: "name" },
  { header: "หน่วย", accessor: "unit" },
  { header: "ราคาทุน", accessor: "cost_price" },
  { header: "ราคาขาย", accessor: "selling_price" },
  {
    header: "หมวดหมู่", accessor: "category_name",
  },
  { header: "Min Stock", accessor: "min_stock" },
];

export const columnAuditLogs: Column<AuditLogType>[] = [
  { header: "Audit ID", accessor: "audit_log_id" },
  { header: "User ID", accessor: "user_id" },
  { header: "Action", accessor: "action" },
  {
    header: "Detail",
    accessor: "detail",
  },
  {
    header: "Created At",
    accessor: "created_at",
  }
];

export const columnSupplier: Column<SupplierType>[] = [
  { header: "ชื่อ", accessor: "name" },
  { header: "เบอร์โทร", accessor: "phone" },
  { header: "อีเมล", accessor: "email" },
  { header: "ที่อยู่", accessor: "address" },
];

export const columnCategory: Column<CatagoriesType>[] = [
  { header: 'ชื่อหมวดหมู่', accessor: 'name' },
  { header: 'คำอธิบาย', accessor: 'description' },
];

