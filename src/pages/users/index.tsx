import { useState } from "react";
import type { UserInfoType } from "../../types/user";
import { useLoadInitialData } from "./hooks/useLoadInitial";
import { UserService } from "../../services/UserService";
import { notify } from "../../utils/Notify";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ActionIcon, Box, Card, Group, Title } from "@mantine/core";
import type { Column } from "../../components/Table/DataTable";
import AppButton from "../../components/Form/AppButton";
import DataTable from "../../components/Table/DataTable";
import ConfirmModal from "../../components/Models/ConfirmModel";
import FormModel from "../../components/Models/FormModel";
import { ROLES } from "../../constants/enum/enum";
import { userCreateSchema, userEditSchema } from "../../schemas/userSchema";
import { parseDate } from "../../utils/getDateUtils";
import { loadingActions } from "../../stores/loadingStore";

function UserManagementPage() {
    const { data, refetch, loading } = useLoadInitialData();

    // State สำหรับ modal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'confirm' | 'form'>('confirm');
    const [selectedItem, setSelectedItem] = useState<UserInfoType | null>(null);

    // เปิด modal confirm delete
    const handleDelete = (item: UserInfoType) => {
        setSelectedItem(item);
        setModalType('confirm');
        setModalOpen(true);
    };

    // เปิด modal edit
    const handleEdit = (product: UserInfoType) => {
        setSelectedItem(product);
        setModalType('form');
        setModalOpen(true);
    };

    const confirmDelete = async () => {
        loadingActions.show();
        if (!selectedItem) return;
        try {
            const res = await UserService.delete(selectedItem.user_id)

            if (!res.ok) {
                notify({
                    type: 'error',
                    message: res.message,
                });
                return;
            }
            notify({
                type: 'success',
                message: 'Delete successful',
            });
            refetch();
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'error to delete';
            console.log(message)
        } finally {
            loadingActions.hide();
        }
        setModalOpen(false);
        setSelectedItem(null);
    };

    const saveItems = async (updatedItems: UserInfoType) => {
        loadingActions.show();
        try {
            let result;

            if (!updatedItems.user_id) {
                result = await UserService.create(updatedItems);
            } else {
                result = await UserService.update(updatedItems.user_id, updatedItems);
            }

            if (!result.ok) {
                notify({
                    type: 'error',
                    message: result.message,
                });
                return;
            }

            notify({
                type: 'success',
                message: updatedItems.user_id
                    ? `Edit User: "${updatedItems.username}" Successfully`
                    : `Create User: "${updatedItems.username}" Successfully`,
            });
            setModalOpen(false);
            setSelectedItem(null);
            refetch();
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'error to save data';

            console.log(message)
        } finally {
            loadingActions.hide();
        }
    };


    const actionColumn = {
        header: 'Action',
        accessor: 'action',
        cell: (row: UserInfoType) => (
            <Group gap="xs">
                <ActionIcon color="blue" onClick={() => handleEdit(row)}>
                    <EditIcon fontSize="small" />
                </ActionIcon>

                <ActionIcon color="red" onClick={() => handleDelete(row)}>
                    <DeleteIcon fontSize="small" />
                </ActionIcon>
            </Group>
        ),
    };

    const columnUsers: Column<UserInfoType>[] = [
        { header: "User ID", accessor: "user_id" },
        {
            header: "Name", accessor: "name",
            cell: (row: UserInfoType) => `${row.first_name || ''} ${row.last_name || ''}`
        },
        { header: "Username", accessor: "username" },
        { header: "Role", accessor: "role" },
        {
            header: "Create At",
            accessor: "created_at",
            cell: (row: UserInfoType) => {
                const { dateString, timeString } = parseDate(row.created_at || "");
                return `${dateString}, ${timeString}`;
            },
        },
    ];

    const columnsWithAction = [...columnUsers, actionColumn]

    const roleOptions = Object.values(ROLES).map((role) => ({
        value: role,
        label: role,
    }));

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group justify="space-between" mb="sm">
                    <Title order={3}>Users Management</Title>
                    <Box style={{
                        display: "flex",
                        gap: "10px"
                    }}>
                        <AppButton
                            loading={loading}
                            onClick={() => {
                                setSelectedItem(null);
                                setModalType('form');
                                setModalOpen(true);
                            }}
                        >
                            Add User
                        </AppButton>
                    </Box>
                </Group>
                <DataTable loading={loading} columns={columnsWithAction} data={data} pageSize={10} />
            </Card>

            {modalType === 'confirm' && (
                <ConfirmModal
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title="ยืนยันการลบ user"
                    message={`คุณต้องการลบ user: "${selectedItem?.username}" ใช่หรือไม่?`}
                    onConfirm={confirmDelete}
                />
            )}

            {modalType === 'form' && (
                <FormModel<UserInfoType>
                    validationSchema={selectedItem ? userEditSchema : userCreateSchema}
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={
                        selectedItem
                            ? `Edit user: "${selectedItem.username}"`
                            : 'Create New User'
                    }
                    initialValues={
                        selectedItem || {
                            user_id: '',
                            first_name: '',
                            last_name: '',
                            username: '',
                            password: '',
                            role: '',
                        }
                    }
                    fields={[
                        { name: 'username', label: 'Username', type: 'text', required: true },
                        { name: 'password', label: 'Password', type: 'password', required: !selectedItem },
                        // { name: 'confirmed_password', label: 'Confirm Password', type: 'password', required: true },
                        { name: 'first_name', label: 'First Name', type: 'text', required: true },
                        { name: 'last_name', label: 'Last Name', type: 'text', required: true },
                        {
                            name: 'role',
                            label: 'Role',
                            type: 'select',
                            disabled: !!selectedItem,
                            options: roleOptions,
                            required: true
                        },
                    ]}
                    onSubmit={saveItems}
                />
            )}
        </Box>
    )
}

export default UserManagementPage
