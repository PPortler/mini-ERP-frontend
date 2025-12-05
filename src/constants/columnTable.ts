import type { Column } from "../components/Table/DataTable";
import type { AuditLogType } from "../types/auditLog";
import type { CatagoriesType } from "../types/catagories";
import type { ProductType } from "../types/product";

export const columnProducts: Column<ProductType>[] = [
  { header: "Product Code", accessor: "product_code" },
  { header: "Product Name", accessor: "name" },
  { header: "Unit", accessor: "unit" },
  { header: "Cost Price", accessor: "cost_price" },
  { header: "Selling Price", accessor: "selling_price" },
  {
    header: "Categoty", accessor: "category_name",
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

export const columnCategory: Column<CatagoriesType>[] = [
  { header: 'Category Name', accessor: 'name' },
  { header: 'Description', accessor: 'description' },
];

