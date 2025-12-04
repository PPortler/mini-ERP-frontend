import { Box, Card, Group, Title, Tabs } from "@mantine/core";
import DataTable from "../../components/Table/DataTable";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { parseDDMMYYYY, parseMonthString, toDDMMYYYY, toMMYYYY } from "../../utils/formatDate";
import AppButton from "../../components/Form/AppButton";
import type { StockSummaryProductType } from "../../types/reports";
import { ReportService } from "../../services/ReportServiec";
import { notify } from "../../utils/Notify";
import { LoadingProvider } from "../../contexts/LoadingContext";
import { TAB_TYPES_REPORTS } from "./const/enum";

function ReportPage() {

    const { setOpenLoading } = LoadingProvider.useLoading();

    const {
        loading,
        stockSummary,
        stockMovements,
        purchaseSummary,
        from,
        to,
        month,
        setFrom,
        setTo,
        setMonth,
        tab,
        setTab
    } = useLoadInitialData();

    const handleExport = async (tab: string) => {
        setOpenLoading(true)
        try {
            let res: { ok: boolean; message?: string };
            switch (tab) {
                case TAB_TYPES_REPORTS.SUMMARY:
                    res = await ReportService.getStockSummaryExportToCsv();
                    break;
                case TAB_TYPES_REPORTS.MOVEMENTS:
                    res = await ReportService.getStockMovementExportToExcel(from, to);
                    break;
                case TAB_TYPES_REPORTS.PURCHASES:
                    res = await ReportService.getPurchaseSummaryExportToExcel(month);
                    break;
                default:
                    return;
            }
            if (!res.ok) {
                notify({
                    type: "error",
                    message: res.message || "Failed to download file!",
                });
                return;
            }
            notify({
                type: "success",
                message: "Download success!",
            });
        } catch (err: unknown) {
            let message = "Something went wrong during export!";
            if (err instanceof Error) {
                message = err.message;
            }
            notify({
                type: "error",
                message,
            });
        } finally {
            setOpenLoading(false)
        }
    };

    const columnStockSummay = [
        { header: "Product Code", accessor: "product_code" },
        { header: "Name Product", accessor: "name" },
        { header: "Category", accessor: "category_name" },
        { header: "Stock On Hand", accessor: "stock_on_hand" },
        { header: "Cost Price", accessor: "cost_price" },
        { header: "Selling Price", accessor: "selling_price" },
        { header: "Total Cost Value", accessor: "total_cost_value" },
        { header: "Total Selling Value", accessor: "total_selling_value" },
        { header: "Min Stock", accessor: "min_stock" },
        {
            header: "Low Stock", accessor: "is_low_stock",
            cell: (row: StockSummaryProductType) => {
                return <>{row.is_low_stock ? "Yes" : "No"}</>
            }
        },
    ]

    const columnStockMovement = [
        { header: "Transaction ID", accessor: "stock_transaction_id" },
        { header: "Date", accessor: "created_at" },
        { header: "Product Code", accessor: "product_code" },
        { header: "Product Name", accessor: "product_name" },
        { header: "Category Name", accessor: "category_name" },
        { header: "Type", accessor: "type" },
        { header: "Quantity", accessor: "quantity" },
        { header: "Reason", accessor: "reason" },
        { header: "Reference ID", accessor: "reference_id" },
        { header: "Create By", accessor: "created_by" },
    ]

    const columnPoSummary = [
        { header: "Status", accessor: "status" },
        { header: "Total Orders", accessor: "total_orders" },
        { header: "Total Amount", accessor: "total_amount" },
        { header: "Average Amount", accessor: "average_amount" },
    ]

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group mb="md" justify="space-between">
                    <Title order={3}>Reports</Title>
                </Group>
                <Tabs value={tab} onChange={(value) => {
                    if (value !== null) setTab(value);
                }}>
                    <Tabs.List>
                        <Tabs.Tab value={TAB_TYPES_REPORTS.SUMMARY}>Stock Summary</Tabs.Tab>
                        <Tabs.Tab value={TAB_TYPES_REPORTS.MOVEMENTS}>Stock Movement</Tabs.Tab>
                        <Tabs.Tab value={TAB_TYPES_REPORTS.PURCHASES}>Purchase Summary</Tabs.Tab>
                    </Tabs.List>

                    {tab === TAB_TYPES_REPORTS.SUMMARY && (
                        <Box pt="md">
                            <Group justify="end" mb="md">
                                <Group>
                                    <AppButton loading={loading} onClick={() => handleExport(tab)}>Export CSV</AppButton>
                                </Group>
                            </Group>
                            <DataTable
                                loading={loading}
                                columns={columnStockSummay}
                                data={stockSummary}
                                pageSize={10}
                            />
                        </Box>
                    )}

                    {tab === TAB_TYPES_REPORTS.MOVEMENTS && (
                        <Box pt="md">
                            <Group justify="space-between" mb="md">
                                <Group>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="From"
                                            value={parseDDMMYYYY(from)}
                                            onChange={(newValue) => {
                                                setFrom(toDDMMYYYY(newValue));
                                            }}
                                            slotProps={{
                                                textField: {
                                                    size: "small",
                                                    fullWidth: false,
                                                }
                                            }}
                                        />
                                        <DatePicker
                                            label="To"
                                            value={parseDDMMYYYY(to)}
                                            onChange={(newValue) => {
                                                setTo(toDDMMYYYY(newValue));
                                            }}
                                            slotProps={{
                                                textField: {
                                                    size: "small",
                                                    fullWidth: false,
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Group>
                                <Group>
                                    <AppButton loading={loading} onClick={() => handleExport(tab)}>Export Excel</AppButton>
                                </Group>
                            </Group>
                            <DataTable
                                loading={loading}
                                columns={columnStockMovement}
                                data={stockMovements}
                                pageSize={10}
                            />
                        </Box>
                    )}

                    {tab === TAB_TYPES_REPORTS.PURCHASES && (
                        <Box pt="md">
                            <Group justify="space-between" mb="md">
                                <Group>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Select Month"
                                            views={["year", "month"]}  // ← เลือกเฉพาะปีและเดือน
                                            format="MM-yyyy"
                                            value={month ? parseMonthString(month) : null}
                                            onChange={(newValue) => {
                                                setMonth(toMMYYYY(newValue));
                                            }}
                                            slotProps={{
                                                textField: {
                                                    size: "small",
                                                    fullWidth: false,
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Group>
                                <Group>
                                    <AppButton loading={loading} onClick={() => handleExport(tab)}>Export Excel</AppButton>
                                </Group>
                            </Group>
                            <DataTable
                                loading={loading}
                                columns={columnPoSummary}
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