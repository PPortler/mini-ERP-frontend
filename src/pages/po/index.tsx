import { useState } from "react";
import { Box, Card, Group, Title, Button } from "@mantine/core";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import type { PurchaseOrderType } from "../../types/purchaes";
import FormModel from "../../components/Models/FormModel";
import { notify } from "../../utils/Notify";
import { PurchaseOrderService } from "../../services/PurchaseOrderService";
import { ROLES, STATUS_PO } from "../../constants/enum/enum";
import { useNavigate } from "react-router-dom";
import { getRoleCurrent } from "../../utils/RoleUtil";
import DataTable from "../../components/Table/DataTable";
import { columnPoOrder } from "../../constants/columnTable";

export default function PoPage() {
    const { purchaseOrders, suppliers, refetch } = useLoadInitialData();
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
        navigate(`/po/${po.purchase_order_id}`);
    };

    const savePO = async (values: PurchaseOrderType) => {
        try {
            const payload = { ...values };

            let result;
            if (!selectedPO) {
                result = await PurchaseOrderService.create(payload);
            } else {
                result = await PurchaseOrderService.update(selectedPO.purchase_order_id, payload);
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

    const actionColumn = {
        header: "Action",
        accessor: "action",
        cell: (row: PurchaseOrderType) => (
            <Group gap="xs">
                {<Button size="xs" onClick={() => handleEditPO(row)}>Edit PO</Button>}
                {<Button size="xs" onClick={() => handleManageProducts(row)}>Manage Products</Button>}
            </Group>
        ),
    };


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
                        <Button onClick={handleCreatePO}>สร้าง PO ใหม่</Button>
                    )}

                </Group>
                <DataTable columns={columnsWithAction} data={purchaseOrders} pageSize={10} />

            </Card>

            {/* Form Modal สำหรับสร้าง/แก้ไข PO */}
            {modalOpen && (
                <FormModel
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={!selectedPO ? "สร้าง PO" : `แก้ไข PO ${selectedPO.purchase_order_id}`}
                    initialValues={
                        selectedPO || {
                            purchase_order_id: "",
                            supplier_id: "",
                            status: STATUS_PO.DRAFT,
                            total_amount: 0,
                        }
                    }
                    fields={[
                        { name: "supplier_id", label: "Supplier", type: "select", options: supplierOptions },
                        {
                            name: "status",
                            label: "Status",
                            type: "select",
                            options: Object.entries(STATUS_PO).map(([, value]) => ({
                                label: value,
                                value,
                            }))
                        },
                    ]}
                    onSubmit={savePO}
                />
            )}
        </Box>
    );
}