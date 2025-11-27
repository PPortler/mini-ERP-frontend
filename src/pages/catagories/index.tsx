import { Box, Button, Card, Group, Title, ActionIcon } from '@mantine/core';
import { useState } from 'react';
import DataTable from '../../components/Table/DataTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getRoleCurrent } from '../../utils/RoleUtil';
import { ROLES } from '../../constants/enum/enum';
import type { CatagoriesType } from '../../types/catagories';
import FormModel from '../../components/Models/FormModel';
import ConfirmModal from '../../components/Models/ConfirmModel';

import { useLoadInitialData } from './hooks/useLoadInitialData';
import { CatagoriesService } from '../../services/CatagoriesService';
import { notify } from '../../utils/Notify';

function CatagoriesPage() {
    const { categories, refetch } = useLoadInitialData();

    const roleCurrent = getRoleCurrent();

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'confirm' | 'form'>('form');
    const [selectedCategory, setSelectedCategory] = useState<CatagoriesType | null>(null);

    const handleEdit = (cat: CatagoriesType) => {
        setSelectedCategory(cat);
        setModalType('form');
        setModalOpen(true);
    };

    const handleDelete = (cat: CatagoriesType) => {
        setSelectedCategory(cat);
        setModalType('confirm');
        setModalOpen(true);
    };

    const saveCategory = async (updated: CatagoriesType) => {
        try {
            let res;
            if (selectedCategory) {
                res = await CatagoriesService.update(
                    selectedCategory.category_id,
                    updated
                );
            }
            else {
                res = await CatagoriesService.create(updated);
            }
            if (res.ok) {
                notify({
                    type: "success",
                    message: selectedCategory
                        ? `แก้ไขหมวดหมู่ "${updated.name}" สำเร็จ`
                        : `เพิ่มหมวดหมู่ "${updated.name}" สำเร็จ`,
                });
            } else {
                notify({
                    type: "error",
                    message: res.message || "เกิดข้อผิดพลาด",
                });
            }
            await refetch();
            setModalOpen(false);
            setSelectedCategory(null);
        } catch (err: any) {
            notify({
                type: "error",
                message: err.message || "เกิดข้อผิดพลาด",
            });
        }
    };

    const confirmDelete = async () => {
        if (!selectedCategory) return;

        try {
            const res = await CatagoriesService.delete(selectedCategory.category_id)

            if (!res.ok) {
                notify({
                    type: 'error',
                    message: res.message || 'เกิดข้อผิดพลาดลบไม่สำเร็จ',
                });
                return;
            }
            notify({
                type: 'success',
                message: 'ลบสำเร็จ',
            });
            refetch();
        } catch (err: any) {
            notify({
                type: "error",
                message: err.message || 'เกิดข้อผิดพลาดลบไม่สำเร็จ',
            })
        }
        setModalOpen(false);
        setSelectedCategory(null);
    };

    const columns = [
        { header: 'ชื่อหมวดหมู่', accessor: 'name' },
        { header: 'คำอธิบาย', accessor: 'description' },
    ];

    const actionColumn = {
        header: 'Action',
        accessor: 'action',
        cell: (row: CatagoriesType) => {
            if (roleCurrent !== ROLES.ADMIN && roleCurrent !== ROLES.STAFF) return null;
            return (
                <Group gap="xs">
                    <ActionIcon color="blue" onClick={() => handleEdit(row)}>
                        <EditIcon fontSize="small" />
                    </ActionIcon>
                    <ActionIcon color="red" onClick={() => handleDelete(row)}>
                        <DeleteIcon fontSize="small" />
                    </ActionIcon>
                </Group>
            );
        },
    };

    const columnsWithAction =
        roleCurrent === ROLES.ADMIN || roleCurrent === ROLES.STAFF
            ? [...columns, actionColumn]
            : [...columns];

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group justify="space-between" mb="sm">
                    <Title order={3}>หมวดหมู่สินค้า</Title>
                    {(roleCurrent === ROLES.ADMIN || roleCurrent === ROLES.STAFF) && (
                        <Button onClick={() => {
                            setSelectedCategory(null);
                            setModalType('form');
                            setModalOpen(true);
                        }}>
                            เพิ่มหมวดหมู่
                        </Button>
                    )}
                </Group>

                <DataTable columns={columnsWithAction} data={categories} pageSize={10} />
            </Card>

            {/* Form */}
            {modalType === 'form' && (
                <FormModel
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={selectedCategory ? `แก้ไขหมวดหมู่ ${selectedCategory.name}` : 'เพิ่มหมวดหมู่'}
                    initialValues={selectedCategory || { category_id: '', name: '', description: '' }}
                    fields={[
                        { name: 'name', label: 'ชื่อหมวดหมู่', type: 'text' },
                        { name: 'description', label: 'คำอธิบาย', type: 'text' },
                    ]}
                    onSubmit={saveCategory}
                />
            )}

            {/* Confirm */}
            {modalType === 'confirm' && selectedCategory && (
                <ConfirmModal
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title="ยืนยันการลบหมวดหมู่"
                    message={`คุณต้องการลบหมวดหมู่ "${selectedCategory.name}" ใช่หรือไม่?`}
                    onConfirm={confirmDelete}
                />
            )}
        </Box>
    );
}

export default CatagoriesPage;