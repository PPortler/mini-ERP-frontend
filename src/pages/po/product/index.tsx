import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, Group, Title, Button } from "@mantine/core";
import DataTable from "../../../components/Table/DataTable";
import FormModel from "../../../components/Models/FormModel";
import { PurchaseOrderService } from "../../../services/PurchaseOrderService";
import { ProductService } from "../../../services/ProductService";
import { notify } from "../../../utils/Notify";
import type { PurchaseOrderItemType } from "../../../types/purchaes";
import type { ProductType } from "../../../types/product";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LoadingProvider } from "../../../contexts/LoadingContext";

export default function PoProductPage() {
    const { setOpenLoading, openLoading } = LoadingProvider.useLoading()
    const { id: purchase_order_id } = useParams<{ id: string }>();
    const { poItems, error, refetch } = useLoadInitialData(purchase_order_id!);
    const navigate = useNavigate();

    const [products, setProducts] = useState<ProductType[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PurchaseOrderItemType | null>(null);

    // Load products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setOpenLoading(true);
                const res = await ProductService.getAll();
                if (res.ok) setProducts(res.data);
            } catch (err: any) {
                notify({ type: "error", message: err.message || "Failed to load products" });
            } finally {
                setOpenLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddItem = () => {
        setSelectedItem(null);
        setModalOpen(true);
    };

    const handleEditItem = (item: PurchaseOrderItemType) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const handleDeleteItem = async (itemId: string) => {
        try {
            await PurchaseOrderService.deleteItem(purchase_order_id!, itemId);
            notify({ type: "success", message: "ลบ item สำเร็จ" });
            refetch();
        } catch (err: any) {
            notify({ type: "error", message: err.message || "เกิดข้อผิดพลาด" });
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
        } catch (err: any) {
            notify({ type: "error", message: err.message || "เกิดข้อผิดพลาด" });
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
                    <Button size="xs" onClick={() => handleEditItem(row)}>Edit</Button>
                    <Button size="xs" color="red" onClick={() => handleDeleteItem(row.purchase_order_item_id)}>Delete</Button>
                </Group>
            ),
        },
    ];

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
                    <Button onClick={handleAddItem} disabled={openLoading}>
                        Add Item
                    </Button>
                </Group>

                <DataTable columns={columns} data={poItems} pageSize={10} />
                {error && <p style={{ color: "red" }}>{error}</p>}
            </Card>

            {modalOpen && (
                <FormModel
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={!selectedItem ? "Add PO Item" : "Edit PO Item"}
                    initialValues={selectedItem || { purchase_order_item_id: "", purchase_order_id: purchase_order_id, product_id: "", quantity: 1, price: 0 }}
                    fields={[
                        { name: "product_id", label: "Product", type: "select", options: productOptions },
                        { name: "quantity", label: "Quantity", type: "number" },
                        { name: "price", label: "Price", type: "number" },
                    ]}
                    onSubmit={saveItem}
                />
            )}
        </Box>
    );
}