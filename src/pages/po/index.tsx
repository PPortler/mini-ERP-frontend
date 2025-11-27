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
import PurchaseOrderTable from "../../components/Table/PurchaseOrderTable";

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

    const savePO = async (values: any) => {
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
        } catch (err: any) {
            notify({ type: "error", message: err.message || "เกิดข้อผิดพลาด" });
        }
    };

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group justify="space-between" mb="md">
                    <Title order={3}>Purchase Orders</Title>
                    {roleCurrent && roleCurrent !== ROLES.ADMIN || roleCurrent && roleCurrent !== ROLES.STAFF && (
                        <Button onClick={handleCreatePO}>สร้าง PO ใหม่</Button>
                    )}

                </Group>
                <PurchaseOrderTable
                    data={purchaseOrders}
                    suppliers={suppliers}
                    onEditPO={handleEditPO}
                    onManageProducts={handleManageProducts}
                />
            </Card>

            {/* Form Modal สำหรับสร้าง/แก้ไข PO */}
            {modalOpen && (
                <FormModel
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={!selectedPO ? "สร้าง PO" : `แก้ไข PO ${selectedPO.purchase_order_id}`}
                    initialValues={
                        selectedPO || {
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
                            options: Object.entries(STATUS_PO).map(([key, value]) => ({ label: value, value }))
                        },
                        // { name: "total_amount", label: "Total Amount", type: "number", disabled: true},
                    ]}
                    onSubmit={savePO}
                />
            )}
        </Box>
    );
}