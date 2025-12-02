import { useState } from "react";
import { Box, Card, Group, Title, Button, ActionIcon } from "@mantine/core";
import DataTable from "../../../components/Table/DataTable";
import FormModel from "../../../components/Models/FormModel";
import { PurchaseOrderService } from "../../../services/PurchaseOrderService";
import { notify } from "../../../utils/Notify";
import type { PurchaseOrderItemType } from "../../../types/purchaes";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation } from "react-router-dom";
import { poOrderItemsSchema } from "../../../schemas/poOrderItemSchema";

export default function PoProductPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const purchase_order_id = searchParams.get("po"); const { poItems, error, refetch, products } = useLoadInitialData(purchase_order_id!);
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PurchaseOrderItemType | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<{ label: string; value: string } | null>(null);

    const handleAddItem = () => {
        setSelectedItem(null);
        setModalOpen(true);
    };

    const handleEditItem = (item: PurchaseOrderItemType) => {
        setSelectedItem(item);
        setSelectedProduct({
            label: item.products?.name || "",
            value: item.product_id
        })
        setModalOpen(true);
    };

    const handleDeleteItem = async (itemId: string) => {
        try {
            await PurchaseOrderService.deleteItem(purchase_order_id!, itemId);
            notify({ type: "success", message: "ลบ item สำเร็จ" });
            refetch();
        } catch (err: unknown) {
            if (err instanceof Error) {
                notify({ type: "error", message: err.message });
            } else {
                notify({ type: "error", message: "เกิดข้อผิดพลาด" });
            }
        }
    };

    const saveItem = async (values: PurchaseOrderItemType) => {
        try {
            if (!selectedItem) {
                console.log(values)
                await PurchaseOrderService.addItem(purchase_order_id!, values);
                notify({ type: "success", message: "เพิ่ม item สำเร็จ" });
            } else {
                await PurchaseOrderService.updateItem(
                    purchase_order_id!,
                    selectedItem.purchase_order_item_id,
                    values
                );
                notify({ type: "success", message: "แก้ไข item สำเร็จ" });
            }
            refetch();
            setModalOpen(false);
            setSelectedItem(null);
            setSelectedProduct(null)
        } catch (err: unknown) {
            if (err instanceof Error) {
                notify({ type: "error", message: err.message });
            } else {
                notify({ type: "error", message: "เกิดข้อผิดพลาด" });
            }
        }
    };

    const productOptions = products.map(p => ({ label: p.name, value: p.product_id }));

    const columns = [
        {
            header: "Product",
            accessor: "product_id",
            cell: (row: PurchaseOrderItemType) => {
                const product = products.find(p => p.product_id === row.product_id);
                return product?.name || "-";
            },
        },
        { header: "Quantity", accessor: "quantity" },
        { header: "Price", accessor: "price" },
        {
            header: "Total",
            accessor: "total",
            cell: (row: PurchaseOrderItemType) => row.quantity * row.price,
        },
        {
            header: "Action",
            accessor: "action",
            cell: (row: PurchaseOrderItemType) => (
                <Group gap="xs">
                    <ActionIcon color="blue" onClick={() => handleEditItem(row)}>
                        <EditIcon fontSize="small" />
                    </ActionIcon>
                    <ActionIcon color="red" onClick={() => handleDeleteItem(row.product_id)}>
                        <DeleteIcon fontSize="small" />
                    </ActionIcon>
                </Group>
            ),
        },
    ];

    const selectedProdDetail = selectedProduct
        ? products.find(p => p.product_id === selectedProduct.value)
        : null;

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group justify="space-between" mb="md">
                    <Group>
                        <IconButton
                            onClick={() => navigate(-1)}
                            size="medium"
                            color="primary"
                            aria-label="back"
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Title order={3}>PO Items for {purchase_order_id}</Title>
                    </Group>
                    <Button onClick={handleAddItem}>
                        Add Item
                    </Button>
                </Group>

                <DataTable columns={columns} data={poItems} pageSize={10} />
                {error && <p style={{ color: "red" }}>{error}</p>}
            </Card>

            {modalOpen && (
                <FormModel
                    opened={modalOpen}
                    onClose={() => {
                        setModalOpen(false)
                        setSelectedProduct(null)
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
                            onChange: (val) => {
                                const prod = productOptions.find(p => p.value === val as string);
                                setSelectedProduct(prod ?? null);
                            }
                        },
                        { name: "quantity", label: "Quantity", type: "number", required: true, },
                        {
                            name: "price",
                            label: "Price",
                            type: "number",
                            required: true,
                            helperText: selectedProdDetail
                                ? `ราคาต้นทุน: ${selectedProdDetail.cost_price}/${selectedProdDetail.unit}`
                                : ''
                        },
                    ]}
                    onSubmit={saveItem}
                    validationSchema={poOrderItemsSchema}
                />
            )}
        </Box>
    );
}