import { useState } from "react";
import { Box, Card, Group, Title, Button, Tabs } from "@mantine/core";
// import DataTable from "../../components/Table/DataTable";
// import { mockCatagories } from "../../mocks/mockCatagories";
import StockTable from "../../components/Table/StockTable";
import {  useLoadInitialData as useLoadStocks } from "../stock/hooks/useLoadInitialData";
import StockTransactionsTable from "../../components/Table/StockTransactionsTable";
import PurchaseOrderTable from "../../components/Table/PurchaseOrderTable";
import { useLoadInitialData as useLoadPo } from "../po/hooks/useLoadInitialData";

function ReportPage() {
    const { products, stockTransactions } = useLoadStocks();
        const { purchaseOrders, suppliers } = useLoadPo();
    
    const [activeTab, setActiveTab] = useState<string | null>("summary");

    // ===================== Columns =====================
    // const purchaseColumns = [
    //     { header: "PO ID", accessor: "purchase_order_id" },
    //     { header: "Status", accessor: "status" },
    //     { header: "Supplier ID", accessor: "supplier_id" },
    //     { header: "Total Amount", accessor: "total_amount" },
    //     { header: "Create By", accessor: "create_by" },
    // ];

    // ===================== Export Handlers =====================
    const handleExportCSV = () => console.log("Export CSV");
    const handleExportExcel = () => console.log("Export Excel");

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group justify="space-between" gap="apart" mb="md">
                    <Title order={3}>รายงาน</Title>
                    <Group>
                        <Button onClick={handleExportCSV}>Export CSV</Button>
                        <Button onClick={handleExportExcel}>Export Excel</Button>
                    </Group>
                </Group>

                <Tabs value={activeTab} onChange={setActiveTab}>
                    <Tabs.List>
                        <Tabs.Tab value="summary">Stock Summary</Tabs.Tab>
                        <Tabs.Tab value="movement">Stock Movement</Tabs.Tab>
                        <Tabs.Tab value="purchase">Purchase Summary</Tabs.Tab>
                    </Tabs.List>

                    {activeTab === "summary" && (
                        <Box pt="md">
                            <StockTable products={products} />
                        </Box>
                    )}

                    {activeTab === "movement" && (
                        <Box pt="md">
                            <StockTransactionsTable transactions={stockTransactions} products={products} />
                        </Box>
                    )}

                    {activeTab === "purchase" && (
                        <Box pt="md">
                            <PurchaseOrderTable
                                data={purchaseOrders}
                                suppliers={suppliers}
                            />
                        </Box>
                    )}
                </Tabs>
            </Card>
        </Box>
    );
}

export default ReportPage;