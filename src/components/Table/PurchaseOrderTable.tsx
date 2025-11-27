import { Button, Group } from "@mantine/core";
import DataTable from "./DataTable"; // สมมติว่า DataTable ของคุณมี props columns, data, pageSize
import type { PurchaseOrderType } from "../../types/purchaes";
import type { SupplierType } from "../../types/suppliers";
import { ROLES } from "../../constants/enum/enum";
import { getRoleCurrent } from "../../utils/RoleUtil";

type PurchaseOrderTableProps = {
    data: PurchaseOrderType[];
    suppliers: SupplierType[];
    onEditPO?: (po: PurchaseOrderType) => void;
    onManageProducts?: (po: PurchaseOrderType) => void;
};

export default function PurchaseOrderTable({
    data,
    suppliers,
    onEditPO,
    onManageProducts,
}: PurchaseOrderTableProps) {
    const roleCurrent = getRoleCurrent();
    
    const actionColumn = {
        header: "Action",
        accessor: "action",
        cell: (row: PurchaseOrderType) => (
            <Group gap="xs">
                {onEditPO && <Button size="xs" onClick={() => onEditPO(row)}>Edit PO</Button>}
                {onManageProducts && <Button size="xs" onClick={() => onManageProducts(row)}>Manage Products</Button>}
            </Group>
        ),
    };

    const columns = [
        { header: "PO ID", accessor: "purchase_order_id" },
        {
            header: "Supplier",
            accessor: "supplier_id",
            cell: (row: PurchaseOrderType) => {
                const supplier = suppliers.find((s) => s.supplier_id === row.supplier_id);
                return supplier?.name || "-";
            },
        },
        { header: "Status", accessor: "status" },
        { header: "Total", accessor: "total_amount" },
        { header: "Created At", accessor: "create_at" },
        ...(roleCurrent === ROLES.ADMIN && onEditPO || roleCurrent === ROLES.STAFF && onEditPO ? [actionColumn] : []),
    ];

    return <DataTable columns={columns} data={data} pageSize={10} />;
}