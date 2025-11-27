import { Group, Button } from "@mantine/core";
import DataTable from "../Table/DataTable";
import type { ProductType } from "../../types/product";
import { TYPE_STOCK_TRANSECTION, ROLES } from "../../constants/enum/enum";
import { getRoleCurrent } from "../../utils/RoleUtil";

type StockTableProps = {
  products: ProductType[];
  onTransaction?: (product: ProductType, type: string) => void;
};

const StockTable = ({ products, onTransaction }: StockTableProps) => {
  const roleCurrent = getRoleCurrent();

  const actionColumn = {
    header: "Action",
    accessor: "action",
    cell: (row: ProductType) =>
      onTransaction ? (
        <Group gap="xs">
          <Button size="xs" onClick={() => onTransaction(row, TYPE_STOCK_TRANSECTION.IN)}>รับเข้า</Button>
          <Button size="xs" onClick={() => onTransaction(row, TYPE_STOCK_TRANSECTION.OUT)}>เบิกออก</Button>
          <Button size="xs" onClick={() => onTransaction(row, TYPE_STOCK_TRANSECTION.ADJUST)}>ปรับยอด</Button>
        </Group>
      ) : null,
  };

  const columns = [
    { header: "รหัสสินค้า", accessor: "product_id" },
    { header: "ชื่อสินค้า", accessor: "name" },
    { header: "หน่วย", accessor: "unit" },
    { header: "หมวดหมู่", accessor: "category_id" },
    { header: "Stock ปัจจุบัน", accessor: "stock" },
    ...(roleCurrent === ROLES.ADMIN && onTransaction || roleCurrent === ROLES.STAFF && onTransaction ? [actionColumn] : []),
  ];

  return <DataTable columns={columns} data={products} pageSize={10} />;
};

export default StockTable;