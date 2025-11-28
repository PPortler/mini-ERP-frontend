import { Box, Card, Group, Title } from "@mantine/core";
import { useLoadInitialData } from "../hooks/useLoadInitialData";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DataTable from "../../../components/Table/DataTable";

export default function StockTransactionsPage() {
    const navigate = useNavigate()
    const { stockTransactions } = useLoadInitialData();

    const columns = [
        { header: "รหัส Transaction", accessor: "stock_transaction_id" },
        { header: "รหัสสินค้า", accessor: "product_id" },
        { header: "ชื่อสินค้า", accessor: "product_name" },
        { header: "ประเภท", accessor: "type" },
        { header: "จำนวน", accessor: "quantity" },
        { header: "สาเหตุ", accessor: "reason" },
        // { header: "อ้างอิง", accessor: "reference" },
        { header: "วันที่", accessor: "created_at", cell: (row: any) => new Date(row.created_at).toLocaleString() },
    ];

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group justify="space-between" mb="sm">
                    <Group>
                        <IconButton
                            onClick={() => navigate(-1)}
                            size="medium"
                            color="primary"
                            aria-label="back"
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Title order={3}>ประวัติรายการสต็อก</Title>
                    </Group>
                </Group>
                <DataTable columns={columns} data={stockTransactions} pageSize={10} />
            </Card>
        </Box>
    );
}