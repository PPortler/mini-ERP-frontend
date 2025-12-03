import { Box, Card, Group, Title } from "@mantine/core";
import DataTable from "../../components/Table/DataTable";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { getRoleCurrent } from "../../utils/RoleUtil";
import { LoadingProvider } from "../../contexts/LoadingContext";
import FilterInputs from "../../components/Filters/FilterSearch";
import AppButton from "../../components/Form/AppButton";
import { useState } from "react";
import { ROLES } from "../../constants/enum/enum";
import FormModel from "../../components/Models/FormModel";
import { TYPE_STOCK_TRANSECTION } from "../../constants/enum/enum";
import type { StockTransactionType } from "../../types/stockTransection";
import { $authUser } from "../../stores/authUserStore";
import { useStore } from "@nanostores/react";
import { notify } from "../../utils/Notify";
import { StockService, type StockServiceResult } from "../../services/StockService";
import { parseDate } from "../../utils/getDateUtils";

export default function StockTransactionsPage() {
    const {
        stockTransactions,
        products,
        loading,
        total,
        page,
        pageSize,
        setPage,
        setPageSize,
        search,
        productId,
        setSearch,
        setProductId,
        refetch,
        setSortOrder,
        setSortField,
        sortField,
        sortOrder
    } = useLoadInitialData({
        initialPage: 1,
        initialPageSize: 10,
        initialSearch: "",
        initialProductId: "",
    });
    const { setOpenLoading } = LoadingProvider.useLoading();
    const roleCurrent = getRoleCurrent();
    const authUser = useStore($authUser)

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<string>();

    const productsOption = products.map(c => ({
        label: c.name,
        value: c.product_id.toString()
    }));

    const handleStock = async (item: StockTransactionType) => {
        setOpenLoading(true)
        const prepare = {
            ...item,
            created_by: authUser?.user_id
        };
        try {
            let res: StockServiceResult | undefined
            if (modalType === TYPE_STOCK_TRANSECTION.ADJUST) {
                res = await StockService.stockAdjust(prepare)
            } else if (modalType === TYPE_STOCK_TRANSECTION.OUT) {
                res = await StockService.stockOut(prepare)
            } else {
                throw new Error("Invalid stock transaction type");
            }

            if (res === undefined) return;
            if (!res.ok) {
                notify({
                    type: 'error',
                    message: res.message || 'เกิดข้อผิดพลาด',
                });
                return;
            }

            notify({
                type: 'success',
                message: 'create stock success.',
            });
            setModalOpen(false);
            refetch();
        } catch (err: unknown) {
            if (err instanceof Error) {
                notify({
                    type: "error",
                    message: err.message || "เกิดข้อผิดพลาด",
                });
            }
        } finally {
            setOpenLoading(false)
        }

    }

    const columnStockTransaction = [
        {
            header: "วันที่", accessor: "created_at",
            cell: (row: StockTransactionType) => {
                const dateObj = parseDate(row.created_at?.toString() || "");
                return <>{dateObj.dateString}, {dateObj.timeString}</>;
            }
        },
        { header: "รหัสสินค้า", accessor: "product_code" },
        { header: "ชื่อสินค้า", accessor: "product_name" },
        { header: "ประเภท", accessor: "type" },
        { header: "จำนวน", accessor: "quantity" },
        { header: "สาเหตุ", accessor: "reason" },
        { header: "reference", accessor: "reference" },
        { header: "create by", accessor: "created_by" },
    ]
    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group mb="sm">
                    <Title order={3}>Stock Transaction</Title>
                </Group>
                <Group justify="space-between">
                    <FilterInputs
                        fields={[
                            {
                                key: "search",
                                label: "ค้นหา",
                                type: "text",
                                value: search,
                                onChange: setSearch,
                            },
                            {
                                key: "productId",
                                label: "สินค้า",
                                type: "select",
                                value: productId,
                                options: productsOption,
                                onChange: setProductId,
                            },
                        ]}
                    />
                    {roleCurrent && roleCurrent !== ROLES.ADMIN || roleCurrent && roleCurrent !== ROLES.STAFF && (
                        <Group >
                            <AppButton
                                loading={loading}
                                onClick={() => {
                                    setModalType(TYPE_STOCK_TRANSECTION.OUT);
                                    setModalOpen(true);
                                }}
                            >
                                Stock OUT
                            </AppButton>
                            <AppButton
                                loading={loading}
                                onClick={() => {
                                    setModalType(TYPE_STOCK_TRANSECTION.ADJUST);
                                    setModalOpen(true);
                                }}
                            >
                                Stock ADJUST
                            </AppButton>
                        </Group>
                    )}
                </Group>
                <DataTable
                    columns={columnStockTransaction}
                    data={stockTransactions}
                    page={page}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    loading={loading}
                    setSortOrder={setSortOrder}
                    setSortField={setSortField}
                    sortField={sortField}
                    sortOrder={sortOrder}
                />
            </Card>
            {modalOpen && (
                <FormModel<StockTransactionType>
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={modalType === TYPE_STOCK_TRANSECTION.ADJUST ? `Stock ${TYPE_STOCK_TRANSECTION.ADJUST}` : `Stock ${TYPE_STOCK_TRANSECTION.OUT}`}
                    initialValues={{
                        stock_transaction_id: '',
                        product_id: '',
                        type: '',
                        quantity: 0,
                        reason: '',
                    }}
                    fields={[
                        {
                            name: "product_id",
                            label: "สินค้า",
                            type: "select",
                            options: productsOption,
                            required: true
                        },
                        { name: 'quantity', label: 'จำนวน', type: 'number', required: true },
                        ...(modalType === TYPE_STOCK_TRANSECTION.ADJUST
                            ? [{ name: 'reason', label: 'สาเหตุ', type: 'text', required: true }]
                            : []),
                    ]}
                    onSubmit={handleStock}
                />
            )}
        </Box>
    );
}
