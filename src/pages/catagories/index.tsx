import { Box, Card, Group, Title, ActionIcon } from '@mantine/core';
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
import FilterInputs from '../../components/Filters/FilterSearch';
import AppButton from '../../components/Form/AppButton';
import { LoadingProvider } from '../../contexts/LoadingContext';
import { categorySchema } from '../../schemas/categorySchema';
import { columnCategory } from '../../constants/columnTable';

function CatagoriesPage() {
    const {
        categories,
        refetch,
        page,
        setPage,
        setPageSize,
        pageSize,
        setSearch,
        search,
        total,
        loading
    } = useLoadInitialData({
        initialPage: 1,
        initialPageSize: 10,
        initialSearch: "",
    });
    const { setOpenLoading } = LoadingProvider.useLoading();
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
        setOpenLoading(true)
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
            if (!res.ok) {
                notify({
                    type: "error",
                    message: res.message || "เกิดข้อผิดพลาด",
                });
                return;
            }
            notify({
                type: "success",
                message: selectedCategory
                    ? `แก้ไขหมวดหมู่ "${updated.name}" สำเร็จ`
                    : `เพิ่มหมวดหมู่ "${updated.name}" สำเร็จ`,
            });
            
            setModalOpen(false);
            setSelectedCategory(null);
            await refetch();
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
    };

    const confirmDelete = async () => {
        setOpenLoading(true)
        if (!selectedCategory) return;
        try {
            const res = await CatagoriesService.delete(selectedCategory.category_id)

            console.log(res)
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
            setModalOpen(false);
            setSelectedCategory(null);
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

    };


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
            ? [...columnCategory, actionColumn]
            : [...columnCategory];

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group justify="space-between" mb="sm">
                    <Title order={3}>หมวดหมู่สินค้า</Title>
                </Group>
                <Group justify='space-between'>
                    <FilterInputs
                        fields={[
                            {
                                key: "search",
                                label: "ค้นหา",
                                type: "text",
                                value: search,
                                onChange: setSearch,
                            },
                        ]}
                    />
                    {(roleCurrent === ROLES.ADMIN || roleCurrent === ROLES.STAFF) && (
                        <AppButton
                            loading={loading}
                            onClick={() => {
                                setSelectedCategory(null);
                                setModalType("form");
                                setModalOpen(true);
                            }}
                            disabled={loading} // ป้องกันคลิกตอน loading
                        >
                            เพิ่มหมวดหมู่
                        </AppButton>
                    )}
                </Group>
                <DataTable
                    columns={columnsWithAction}
                    data={categories}
                    page={page}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    loading={loading}
                />
            </Card>

            {/* Form */}
            {modalType === 'form' && (
                <FormModel
                    validationSchema={categorySchema}
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={selectedCategory ? `แก้ไขหมวดหมู่ ${selectedCategory.name}` : 'เพิ่มหมวดหมู่'}
                    initialValues={selectedCategory || { category_id: '', name: '', description: '' }}
                    fields={[
                        { name: 'name', label: 'ชื่อหมวดหมู่', type: 'text', required: true },
                        { name: 'description', label: 'คำอธิบาย', type: 'text', required: true },
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