import { useState } from "react";
import { Box, Card, Group, Title, Button, Tabs } from "@mantine/core";
import DataTable from "../../components/Table/DataTable";
import { useLoadInitialData } from "./hooks/useLoadInitialData";

function ReportPage() {
    const [activeTab, setActiveTab] = useState<string | null>("summary");
    const {
        stockSummary,
        stockMovements,
        purchaseSummary,
    } = useLoadInitialData();

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
                            <DataTable
                                columns={[
                                    { header: "สินค้า", accessor: "name" },
                                    { header: "Stock ปัจจุบัน", accessor: "current_stock" },
                                    { header: "มูลค่า Cost", accessor: "cost_value" },
                                    { header: "มูลค่า Selling", accessor: "selling_value" },
                                ]}
                                data={stockSummary}
                                pageSize={10}
                            />
                        </Box>
                    )}

                    {activeTab === "movement" && (
                        <Box pt="md">
                            <DataTable
                                columns={[
                                    { header: "วันที่", accessor: "created_at" },
                                    { header: "สินค้า", accessor: "product_name" },
                                    { header: "ประเภท", accessor: "type" },
                                    { header: "จำนวน", accessor: "quantity" },
                                    { header: "เหตุผล/หมายเหตุ", accessor: "reason" },
                                ]}
                                data={stockMovements}
                                pageSize={10}
                            />
                        </Box>
                    )}

                    {activeTab === "purchase" && (
                        <Box pt="md">
                            <DataTable
                                columns={[
                                    { header: "PO ID", accessor: "purchase_order_id" },
                                    { header: "Supplier", accessor: "supplier_name" },
                                    { header: "สถานะ", accessor: "status" },
                                    { header: "จำนวนเงินรวม", accessor: "total_amount" },
                                    { header: "วันที่สร้าง", accessor: "create_at" },
                                ]}
                                data={Array.isArray(purchaseSummary) ? purchaseSummary : []}
                                pageSize={10}
                            />
                        </Box>
                    )}
                </Tabs>
            </Card>
        </Box>
    );
}

export default ReportPage;