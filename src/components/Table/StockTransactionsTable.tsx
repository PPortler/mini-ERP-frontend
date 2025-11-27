import DataTable from "../Table/DataTable";
import type { StockTransactionType } from "../../types/stockTransection";
import type { ProductType } from "../../types/product";

type StockTransactionsTableProps = {
    transactions: StockTransactionType[];
    products: ProductType[];
};

const StockTransactionsTable = ({ transactions, products }: StockTransactionsTableProps) => {
    const columns = [
        { header: "รหัส Transaction", accessor: "stock_transaction_id" },
        { header: "รหัสสินค้า", accessor: "product_id" },
        {
            header: "ชื่อสินค้า",
            accessor: "product_name",
            cell: (row: StockTransactionType) => {
                const product = products.find(p => p.product_id === row.product_id);
                return product?.name || "-";
            },
        },
        { header: "ประเภท", accessor: "type" },
        { header: "จำนวน", accessor: "quantity" },
        { header: "สาเหตุ", accessor: "reason" },
        { header: "อ้างอิง", accessor: "reference" },
        { header: "วันที่", accessor: "created_at", cell: (row: any) => new Date(row.created_at).toLocaleString() },
    ];

    return <DataTable columns={columns} data={transactions} pageSize={10} />;
};

export default StockTransactionsTable;