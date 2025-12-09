import { Box, Card, Group, Title, ActionIcon } from '@mantine/core';
import { useState } from 'react';
import DataTable, { type Column } from '../../components/Table/DataTable';
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
import AppButton from '../../components/UI/Button/AppButton';
import { categorySchema } from '../../schemas/categorySchema';
import { loadingActions } from '../../stores/loadingStore';

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
        loading,
        setSortOrder,
        setSortField,
        sortField,
        sortOrder
    } = useLoadInitialData();
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
        loadingActions.show();
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
                    message: res.message,
                });
                return;
            }
            notify({
                type: "success",
                message: selectedCategory
                    ? `Edit Category "${updated.name}" Successfully`
                    : `Create Category "${updated.name}" Successfully`,
            });

            setModalOpen(false);
            setSelectedCategory(null);
            await refetch();
        } catch (err: unknown) {
            if (err instanceof Error) {
                notify({
                    type: "error",
                    message: err.message,
                });
            }
        } finally {
            loadingActions.hide();
        }
    };

    const confirmDelete = async () => {
        loadingActions.show();
        if (!selectedCategory) return;
        try {
            const res = await CatagoriesService.delete(selectedCategory.category_id)

            console.log(res)
            if (!res.ok) {
                notify({
                    type: 'error',
                    message: res.message,
                });
                return;
            }
            notify({
                type: 'success',
                message: 'Delete successfully',
            });
            setModalOpen(false);
            setSelectedCategory(null);
            refetch();
        } catch (err: unknown) {
            if (err instanceof Error) {
                notify({
                    type: "error",
                    message: err.message,
                });
            }
        } finally {
            loadingActions.hide();
        }

    };


    const actionColumn = {
        header: 'Action',
        accessor: 'action',
        cell: (row: CatagoriesType) => {
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

    const columnCategory: Column<CatagoriesType>[] = [
        { header: 'Category Name', accessor: 'name' },
        { header: 'Description', accessor: 'description' },
    ];

    const columnsWithAction =
        (roleCurrent === ROLES.ADMIN)
            ? [...columnCategory, actionColumn]
            : [...columnCategory];

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group justify="space-between" mb="sm">
                    <Title order={3}>Categories</Title>
                </Group>
                <Group justify='space-between'>
                    <FilterInputs
                        fields={[
                            {
                                key: "search",
                                label: "Search",
                                type: "text",
                                placeholder: "category name or description",
                                value: search,
                                onChange: setSearch,
                            },
                        ]}
                    />
                    {(roleCurrent === ROLES.ADMIN) && (
                        <AppButton
                            loading={loading}
                            onClick={() => {
                                setSelectedCategory(null);
                                setModalType("form");
                                setModalOpen(true);
                            }}
                            disabled={loading} // ป้องกันคลิกตอน loading
                        >
                            Create Category
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
                    setSortField={setSortField}
                    setSortOrder={setSortOrder}
                    sortField={sortField}
                    sortOrder={sortOrder}
                />
            </Card>

            {/* Form */}
            <FormModel
                validationSchema={categorySchema}
                opened={modalType === 'form' && modalOpen}
                onClose={() => setModalOpen(false)}
                title={selectedCategory ? `Edit Category ${selectedCategory.name}` : 'Create Category'}
                initialValues={selectedCategory || { category_id: '', name: '', description: '' }}
                fields={[
                    { name: 'name', label: 'Category Name', type: 'text', required: true },
                    { name: 'description', label: 'Description', type: 'text', required: true },
                ]}
                onSubmit={saveCategory}
            />

            {/* Confirm */}
            <ConfirmModal
                opened={modalType === 'confirm' && modalOpen}
                onClose={() => setModalOpen(false)}
                title="Confirm Delete Category"
                message={`Do you want to delete category: "${selectedCategory?.name}" ?`}
                onConfirm={confirmDelete}
            />
        </Box>
    );
}

export default CatagoriesPage;