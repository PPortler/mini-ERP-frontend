import { useState } from "react";
import { Box, Card, Group, Title, ActionIcon, Text, Stack } from "@mantine/core";
import DataTable from "../../../components/Table/DataTable";
import FormModel from "../../../components/Models/FormModel";
import { PurchaseOrderService } from "../../../services/PurchaseOrderService";
import { notify } from "../../../utils/Notify";
import type { PurchaseOrderItemType } from "../../../types/purchaes";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation } from "react-router-dom";
import { poOrderItemsSchemaAdd, poOrderItemsSchemaEdit } from "../../../schemas/poOrderItemSchema";
import AppButton from "../../../components/UI/Button/AppButton";
import { ROLES, STATUS_PO } from "../../../constants/enum/enum";
import { loadingActions } from "../../../stores/loadingStore";
import ConfirmModal from "../../../components/Models/ConfirmModel";
import { AppText } from "../../../components/UI/Text/AppText";
import { getRoleCurrent } from "../../../utils/RoleUtil";
import { BackButton } from "../../../components/UI/Button/BackButton";

export default function PoProductPage() {
    const roleCurrent = getRoleCurrent()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const purchase_order_id = searchParams.get("po");
    const { poItems, refetch, products, loading, poOrderInfo } = useLoadInitialData(purchase_order_id!);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PurchaseOrderItemType | null>(null);

    // modal confirm delete
    const handleDelete = (item: PurchaseOrderItemType) => {
        setSelectedItem(item);
        setModalConfirmOpen(true);
    };

    const handleAddItem = () => {
        setSelectedItem(null);
        setModalOpen(true);
    };

    const handleEditItem = (item: PurchaseOrderItemType) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const handleDeleteItem = async () => {
        loadingActions.show()

        const itemId = selectedItem?.product_id || ""
        try {
            const res = await PurchaseOrderService.deleteItem(purchase_order_id!, itemId);
            if (!res.ok) {
                notify({ type: "error", message: res.message });
                return;
            }
            notify({ type: "success", message: "Deleted Item Successfully" });
            refetch();
            setModalConfirmOpen(false)
        } catch (err: unknown) {
            if (err instanceof Error) {
                notify({ type: "error", message: err.message });
            }
        } finally {
            loadingActions.hide()
        }
    };

    const saveItem = async (values: PurchaseOrderItemType) => {
        loadingActions.show();
        try {
            if (!selectedItem) {
                const res = await PurchaseOrderService.addItem(purchase_order_id!, values);
                if (!res.ok) {
                    notify({ type: "error", message: res.message });
                    return;
                }
                notify({ type: "success", message: "Created Item Successfully" });
            } else {
                const res = await PurchaseOrderService.updateItem(
                    purchase_order_id!,
                    selectedItem.purchase_order_item_id,
                    values
                );
                if (!res.ok) {
                    notify({ type: "error", message: res.message });
                    return;
                }
                notify({ type: "success", message: "Edit Item Successfully" });
            }
            refetch();
            setModalOpen(false);
            setSelectedItem(null);
        } catch (err: unknown) {
            if (err instanceof Error) {
                notify({ type: "error", message: err.message });
            }
        } finally {
            loadingActions.hide();
        }
    };

    const productOptions = products.map(p => ({ label: p.name, value: p.product_id }));

    const columns = [
        {
            header: "Product",
            accessor: "product_id",
            cell: (row: PurchaseOrderItemType) => {
                return row.product?.name || "-";
            },
        },
        { header: "Quantity", accessor: "quantity" },
        { header: "Price", accessor: "price" },
        {
            header: "Total",
            accessor: "total",
            cell: (row: PurchaseOrderItemType) => row.quantity * (row?.price || 0),
        },
        {
            header: "Mark",
            accessor: "mark",
            cell: (row: PurchaseOrderItemType) => {
                const isLowCost = (row.price || 0) < (row.product?.cost_price || 0)
                return (
                    <Text size="sm" color={isLowCost ? "red" : ""}>
                        {isLowCost ? "Price lower than cost" : "-"}
                    </Text>
                )
            }
        }
    ];

    const actionColumn = {
        header: 'Action',
        accessor: 'action',
        cell: (row: PurchaseOrderItemType) => (
            <Group gap="xs">
                <ActionIcon color="blue" onClick={() => handleEditItem(row)}>
                    <EditIcon fontSize="small" />
                </ActionIcon>
                <ActionIcon color="red" onClick={() => handleDelete(row)}>
                    <DeleteIcon fontSize="small" />
                </ActionIcon>
            </Group>
        ),
    };

    const columnsWithAction =
        poOrderInfo && poOrderInfo.status === STATUS_PO.DRAFT
            ? [...columns, actionColumn]
            : [...columns];

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group justify="space-between" align="end" mb="md">
                    <Group align="start">
                        <BackButton />
                        <Stack gap={1}>
                            <Title order={3} mb="">PO Items for {purchase_order_id}</Title>
                            {(roleCurrent === ROLES.ADMIN || roleCurrent === ROLES.STAFF) && (
                                <>
                                    <AppText loading={loading} skeletonWidth={200} c="dimmed">Supplier: {poOrderInfo?.supplier?.name}</AppText>
                                    <AppText loading={loading} skeletonWidth={200} c="dimmed">Email: {poOrderInfo?.supplier?.email}</AppText>
                                    <AppText loading={loading} skeletonWidth={220} c="dimmed">Phone: {poOrderInfo?.supplier?.phone}</AppText>
                                    <AppText loading={loading} skeletonWidth={250} c="dimmed">Address: {poOrderInfo?.supplier?.address}</AppText>
                                </>
                            )}
                        </Stack>
                    </Group>
                    {poOrderInfo && poOrderInfo.status === STATUS_PO.DRAFT && (
                        <AppButton loading={loading} onClick={handleAddItem}>
                            Add Item
                        </AppButton>
                    )}
                </Group>

                <DataTable loading={loading} columns={columnsWithAction} data={poItems} pageSize={10} />
            </Card>

            <ConfirmModal
                opened={modalConfirmOpen}
                onClose={() => setModalConfirmOpen(false)}
                title="Confirm Delete Product"
                message={`Do you want to delete product: "${selectedItem?.product?.name}" ?`}
                onConfirm={handleDeleteItem}
            />

            <FormModel
                opened={modalOpen}
                onClose={() => {
                    setModalOpen(false)
                }}
                title={!selectedItem ? "Add PO Item" : "Edit PO Item"}
                initialValues={selectedItem ||
                {
                    purchase_order_item_id: "",
                    purchase_order_id: purchase_order_id ?? "",
                    product_id: "",
                    quantity: 1,
                    price: 0
                }}
                fields={[
                    {
                        name: "product_id",
                        label: "Product",
                        type: "select",
                        required: true,
                        options: productOptions,
                    },
                    { name: "quantity", label: "Quantity", type: "number", required: true, },
                    ...(selectedItem
                        ? [{
                            name: "price",
                            label: "Price",
                            type: "number",
                            required: true,
                            helperText: `Cost Price: ${selectedItem.product?.cost_price}/${selectedItem.product?.unit}`
                        }]
                        : [])
                ]}
                onSubmit={saveItem}
                validationSchema={
                    selectedItem
                        ? poOrderItemsSchemaEdit
                        : poOrderItemsSchemaAdd
                }
            />
        </Box>
    );
}