import { useState } from "react";
import { Box, Card, Group, Title } from "@mantine/core";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import type { PurchaseOrderType } from "../../types/purchaes";
import FormModel from "../../components/Models/FormModel";
import { notify } from "../../utils/Notify";
import { PurchaseOrderService } from "../../services/PurchaseOrderService";
import { ROLES, STATUS_PO, TABLE_CONFIG } from "../../constants/enum/enum";
import { useNavigate } from "react-router-dom";
import { getRoleCurrent } from "../../utils/RoleUtil";
import DataTable from "../../components/Table/DataTable";
import { poOrderSchema } from "../../schemas/poOrderSchema";
import usePOActionColumn from "./hooks/usePOActionColumn";
import StatusBadge from "../../components/UI/StatusBagde";
import AppButton from "../../components/UI/Button/AppButton";
import { useStore } from "@nanostores/react";
import { $authUser } from "../../stores/authUserStore";
import { parseDate } from "../../utils/getDateUtils";
import { loadingActions } from "../../stores/loadingStore";
import FilterInputs from "../../components/Filters/FilterSearch";

export default function PoPage() {
    const {
        purchaseOrders,
        suppliers,
        refetch,
        loading,
        setStatus,
        // setSortField,
        status
    } = useLoadInitialData();
    const navigate = useNavigate();
    const user = useStore($authUser)
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
        loadingActions.show();

        const prepare = {
            ...values,
            supplier_id: values.supplier_id,
            created_by: user?.id,
        }
        try {
            let result;
            if (!selectedPO) {
                result = await PurchaseOrderService.create(prepare);
            } else {
                result = await PurchaseOrderService.update(selectedPO.purchase_order_id, prepare);
            }

            if (!result.ok) {
                notify({
                    type: 'error',
                    message: result.message,
                });
                return;
            }
            notify({
                type: "success",
                message: !selectedPO ? "Create PO Success" : "Edit PO Success",
            });
            setModalOpen(false);
            setSelectedPO(null);
            await refetch();
        } catch (err: unknown) {
            notify({
                type: "error",
                message: err instanceof Error ? err.message : "Error to save PO",
            });
        } finally {
            loadingActions.hide();
        }
    };

    const handleChangeStatus = async (po: PurchaseOrderType, newStatus: string) => {
        loadingActions.show();
        try {
            const result = await PurchaseOrderService.updateStatus(po.purchase_order_id, newStatus, user?.user_id || "");
            if (result.ok) {
                notify({ type: "success", message: `Change status to ${newStatus} successfully` });
                await refetch();
            } else {
                notify({ type: "error", message: result.message });
            }
        } catch (err: unknown) {
            notify({
                type: "error",
                message: err instanceof Error ? err.message : "Error to change status",
            });
        } finally {
            loadingActions.hide();
        }
    };

    const handleDeletePO = async (po: PurchaseOrderType) => {
        try {
            const result = await PurchaseOrderService.delete(po.purchase_order_id);

            if (result.ok) {
                notify({ type: "success", message: "Deleted successfully" });
                await refetch(); // โหลดข้อมูลใหม่
            } else {
                notify({ type: "error", message: result.message });
            }
        } catch (err: unknown) {
            notify({
                type: "error",
                message: err instanceof Error ? err.message : "Error to delete PO",
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
            cell: (row: PurchaseOrderType) => {
                const statusColor: Record<string, string> = {
                    [STATUS_PO.DRAFT]: "gray",
                    [STATUS_PO.CONFIRMED]: "blue",
                    [STATUS_PO.RECEIVED]: "green",
                    [STATUS_PO.CANCELLED]: "red",
                };
                return <StatusBadge statusColor={statusColor} status={row.status} />
            },
        },
        {
            header: "Created At", accessor: "created_at",
            cell: (row: PurchaseOrderType) => {
                const { dateString, timeString } = parseDate(row.created_at || "");
                return `${dateString}, ${timeString}`;
            },
        },
    ];

    const statusOptions = Object.entries(STATUS_PO).map(([key, value]) => ({
        value,
        label: key.charAt(0) + key.slice(1).toLowerCase(),
    }));

    const actionColumn = usePOActionColumn(
        handleEditPO,
        handleManageProducts,
        handleChangeStatus,
        handleDeletePO
    );

    const columnsWithAction = [...columnPoOrder, actionColumn];

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group justify="space-between" mb="md">
                    <Title order={3}>Purchase Orders</Title>
                </Group>
                <Group justify="space-between">
                    <FilterInputs
                        fields={[
                            {
                                key: "status",
                                label: "Status",
                                type: "select",
                                value: status,
                                options: statusOptions,
                                onChange: setStatus,
                            },
                        ]}
                    />
                    {(roleCurrent === ROLES.ADMIN || roleCurrent === ROLES.STAFF) && (
                        <AppButton loading={loading} onClick={handleCreatePO}>Create Po.</AppButton>
                    )}
                </Group>
                <DataTable
                    // setSortField={setSortField}
                    loading={loading}
                    columns={columnsWithAction}
                    data={purchaseOrders}
                    pageSize={TABLE_CONFIG.DEFAULT_PAGE_SIZE}
                />
            </Card>
            {/* Form Modal สำหรับสร้าง/แก้ไข PO */}
            <FormModel
                validationSchema={poOrderSchema}
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                title={!selectedPO ? "Create Purchase Order" : `Edit Purchase Order ${selectedPO.purchase_order_id}`}
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
        </Box>
    );
}