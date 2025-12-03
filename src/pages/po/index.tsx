import { useState } from "react";
import { Box, Card, Group, Title } from "@mantine/core";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import type { PurchaseOrderType } from "../../types/purchaes";
import FormModel from "../../components/Models/FormModel";
import { notify } from "../../utils/Notify";
import { PurchaseOrderService } from "../../services/PurchaseOrderService";
import { ROLES, STATUS_PO } from "../../constants/enum/enum";
import { useNavigate } from "react-router-dom";
import { getRoleCurrent } from "../../utils/RoleUtil";
import DataTable from "../../components/Table/DataTable";
import { poOrderSchema } from "../../schemas/poOrderSchema";
import usePOActionColumn from "./hooks/usePOActionColumn";
import StatusBadge from "../../components/Polish/StatusBagde";
import AppButton from "../../components/Form/AppButton";

export default function PoPage() {
    const { purchaseOrders, suppliers, refetch, loading } = useLoadInitialData();
    const navigate = useNavigate();
    const roleCurrent = getRoleCurrent();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPO, setSelectedPO] = useState<PurchaseOrderType | null>(null);

    // สำหรับ dropdown
    const supplierOptions = suppliers.map((s) => ({ label: s.name, value: s.supplier_id }));

    const handleCreatePO = () => {
        setSelectedPO(null);
        setModalOpen(true);
    };

    const handleEditPO = (po: PurchaseOrderType) => {
        setSelectedPO(po);
        setModalOpen(true);
    };

    const handleManageProducts = (po: PurchaseOrderType) => {
        navigate(`/po/products?po=${po.purchase_order_id}`);
    };

    const savePO = async (values: PurchaseOrderType) => {
        try {
            let result;
            if (!selectedPO) {
                result = await PurchaseOrderService.create(values);
            } else {
                result = await PurchaseOrderService.update(selectedPO.purchase_order_id, values);
            }

            if (result.ok) {
                notify({
                    type: "success",
                    message: !selectedPO ? "สร้าง PO สำเร็จ" : "แก้ไข PO สำเร็จ",
                });
                await refetch();
                setModalOpen(false);
                setSelectedPO(null);
            } else {
                notify({ type: "error", message: result.message || "เกิดข้อผิดพลาด" });
            }
        } catch (err: unknown) {
            notify({
                type: "error",
                message: err instanceof Error ? err.message : "เกิดข้อผิดพลาด",
            });
        }
    };

    const handleChangeStatus = async (po: PurchaseOrderType, newStatus: string) => {
        try {
            const result = await PurchaseOrderService.updateStatus(po.purchase_order_id, newStatus);
            if (result.ok) {
                notify({ type: "success", message: `เปลี่ยนสถานะเป็น ${newStatus} สำเร็จ` });
                await refetch();
            } else {
                notify({ type: "error", message: result.message || "เกิดข้อผิดพลาด" });
            }
        } catch (err: unknown) {
            notify({
                type: "error",
                message: err instanceof Error ? err.message : "เกิดข้อผิดพลาด",
            });
        }
    };

    const handleDeletePO = async (po: PurchaseOrderType) => {
        try {
            const result = await PurchaseOrderService.delete(po.purchase_order_id);

            if (result.ok) {
                notify({ type: "success", message: "ลบสำเร็จ" });
                await refetch(); // โหลดข้อมูลใหม่
            } else {
                notify({ type: "error", message: result.message || "ไม่สามารถลบได้" });
            }
        } catch (err: unknown) {
            notify({
                type: "error",
                message: err instanceof Error ? err.message : "เกิดข้อผิดพลาด",
            });
        }
    };

    const columnPoOrder = [
        { header: "PO ID", accessor: "purchase_order_id" },
        {
            header: "Supplier",
            accessor: "supplier_name",
        },
        {
            header: "Status", accessor: "status",
            cell: (row: PurchaseOrderType) => <StatusBadge status={row.status} />,
        },
        { header: "Total", accessor: "total_amount" },
        { header: "Created At", accessor: "create_at" },
    ];

    const actionColumn = usePOActionColumn(
        handleEditPO,
        handleManageProducts,
        handleChangeStatus,
        handleDeletePO
    );

    const columnsWithAction =
        roleCurrent !== ROLES.ADMIN && roleCurrent !== ROLES.STAFF
            ? [...columnPoOrder]
            : [...columnPoOrder, actionColumn];

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group justify="space-between" mb="md">
                    <Title order={3}>Purchase Orders</Title>
                    {roleCurrent && roleCurrent !== ROLES.ADMIN || roleCurrent && roleCurrent !== ROLES.STAFF && (
                        <AppButton loading={loading} onClick={handleCreatePO}>Create Po.</AppButton>
                    )}
                </Group>
                <DataTable loading={loading} columns={columnsWithAction} data={purchaseOrders} pageSize={10} />
            </Card>
            {/* Form Modal สำหรับสร้าง/แก้ไข PO */}
            {modalOpen && (
                <FormModel
                    validationSchema={poOrderSchema}
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={!selectedPO ? "สร้าง Purchase Order" : `แก้ไข Purchase Order ${selectedPO.purchase_order_id}`}
                    initialValues={selectedPO || {
                        purchase_order_id: "",
                        supplier_id: "",
                        status: STATUS_PO.DRAFT,
                        total_amount: 0,
                    }}
                    fields={[
                        {
                            name: "supplier_id",
                            label: "Supplier",
                            type: "select",
                            required: true,
                            options: supplierOptions,
                        },
                    ]}
                    onSubmit={savePO}
                />
            )}
        </Box>
    );
}