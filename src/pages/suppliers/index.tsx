import { ActionIcon, Box, Card, Group, Title } from '@mantine/core'
import DataTable, { type Column } from '../../components/Table/DataTable'
import { useLoadInitialData } from './hooks/useLoadInitialData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getRoleCurrent } from '../../utils/RoleUtil';
import { ROLES, TABLE_CONFIG } from '../../constants/enum/enum';
import { useState } from 'react';
import type { SupplierType } from '../../types/suppliers';
import FormModel from '../../components/Models/FormModel';
import ConfirmModal from '../../components/Models/ConfirmModel';
import { SupplierService } from '../../services/SupplierService';
import { notify } from '../../utils/Notify';
import { supplierSchema } from '../../schemas/supplierSchema';
import AppButton from '../../components/UI/Button/AppButton';
import { loadingActions } from '../../stores/loadingStore';

function SupplierPage() {
  const { data, refetch, loading } = useLoadInitialData();
  const roleCurrent = getRoleCurrent();

  // State สำหรับ modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'confirm' | 'form'>('confirm');
  const [selectedItem, setSelectedItem] = useState<SupplierType | null>(null);

  // เปิด modal confirm delete
  const handleDelete = (item: SupplierType) => {
    setSelectedItem(item);
    setModalType('confirm');
    setModalOpen(true);
  };

  // เปิด modal edit
  const handleEdit = (product: SupplierType) => {
    setSelectedItem(product);
    setModalType('form');
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    loadingActions.show();
    if (!selectedItem) return;
    try {
      const res = await SupplierService.delete(selectedItem.supplier_id)

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
          : 'Delete error';

      notify({
        type: "error",
        message,
      });
    } finally {
      loadingActions.hide();
    }
    setModalOpen(false);
    setSelectedItem(null);
  };

  const saveItems = async (updatedItems: SupplierType) => {
    loadingActions.show();
    try {
      let result;

      if (!updatedItems.supplier_id) {
        result = await SupplierService.create(updatedItems);
      } else {
        result = await SupplierService.update(updatedItems.supplier_id, updatedItems);
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
        message: updatedItems.supplier_id
          ? `Edit Supplier "${updatedItems.name}" Successful`
          : `Create Supplier "${updatedItems.name}" Successful`,
      });
      setModalOpen(false);
      setSelectedItem(null);
      refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error to save';

      notify({
        type: 'error',
        message,
      });
    } finally {
      loadingActions.hide();
    }
  };

  const actionColumn = {
    header: 'Action',
    accessor: 'action',
    cell: (row: SupplierType) => (
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

  const columnSupplier: Column<SupplierType>[] = [
    { header: "Supplier Name", accessor: "name" },
    { header: "Phone", accessor: "phone" },
    { header: "Email", accessor: "email" },
    { header: "Address", accessor: "address" },
  ];

  const columnsWithAction =
    roleCurrent !== ROLES.ADMIN
      ? [...columnSupplier]
      : [...columnSupplier, actionColumn];

  return (
    <Box>
      <Card shadow="sm" padding="lg">
        <Group justify="space-between" mb="sm">
          <Title order={3}>Supplier</Title>
          <Box style={{
            display: "flex",
            gap: "10px"
          }}>
            {roleCurrent === ROLES.ADMIN && (
              <AppButton
                loading={loading}
                onClick={() => {
                  setSelectedItem(null);
                  setModalType('form');
                  setModalOpen(true);
                }}
              >
                Create Supplier
              </AppButton>
            )}
          </Box>
        </Group>
        <DataTable 
        loading={loading} 
        columns={columnsWithAction} 
        data={data} 
        pageSize={TABLE_CONFIG.DEFAULT_PAGE_SIZE} />
      </Card>

      <ConfirmModal
        opened={modalType === 'confirm' && modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Delete Supplier"
        message={`Do you want to delete supplier: "${selectedItem?.name}" ?`}
        onConfirm={confirmDelete}
      />
      <FormModel<SupplierType>
        validationSchema={supplierSchema}
        opened={modalType === 'form' && modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          selectedItem
            ? `Edit Supplier "${selectedItem.name}"`
            : 'Create New Supplier'
        }
        initialValues={
          selectedItem || {
            supplier_id: '',
            name: '',
            phone: '',
            email: '',
            address: '',
          }
        }
        fields={[
          { name: 'name', label: 'Supplier Name', type: 'text', required: true },
          { name: 'phone', label: 'Phone', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'text', required: true },
          { name: 'address', label: 'Address', type: 'text', required: true },
        ]}
        onSubmit={saveItems}
      />
    </Box>
  )
}

export default SupplierPage
