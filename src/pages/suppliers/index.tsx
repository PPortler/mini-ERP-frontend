import { ActionIcon, Box, Button, Card, Group, Title } from '@mantine/core'
import DataTable from '../../components/Table/DataTable'
import { useLoadInitialData } from './hooks/useLoadInitialData';
import { columnSupplier } from '../../constants/columnTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getRoleCurrent } from '../../utils/RoleUtil';
import { ROLES } from '../../constants/enum/enum';
import { useState } from 'react';
import type { SupplierType } from '../../types/suppliers';
import FormModel from '../../components/Models/FormModel';
import ConfirmModal from '../../components/Models/ConfirmModel';
import { SupplierService } from '../../services/SupplierService';
import { notify } from '../../utils/Notify';
import { LoadingProvider } from '../../contexts/LoadingContext';
import { supplierSchema, type SupplierFormValue } from '../../schemas/supplierSchema';

function SupplierPage() {
  const { setOpenLoading } = LoadingProvider.useLoading();
  const { data, refetch } = useLoadInitialData();
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
    if (!selectedItem) return;
    try {
      const res = await SupplierService.delete(selectedItem.supplier_id)

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
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'เกิดข้อผิดพลาดลบไม่สำเร็จ';

      notify({
        type: "error",
        message,
      });
    }
    setModalOpen(false);
    setSelectedItem(null);
  };

  const saveItems = async (updatedItems: SupplierType) => {
    setOpenLoading(true);

    try {
      const values: SupplierFormValue = await supplierSchema.validate(updatedItems, { abortEarly: false });

      let result;
      if (!updatedItems.supplier_id) {
        result = await SupplierService.create({
          name: values.name,
          phone: values.phone,
          email: values.email,
          address: values.address
        });
      } else {
        result = await SupplierService.update(updatedItems.supplier_id, updatedItems);
      }

      if (result.ok && result.data.length > 0) {
        notify({
          type: 'success',
          message: updatedItems.supplier_id
            ? `แก้ไข Supplier "${updatedItems.name}" สำเร็จ`
            : `เพิ่ม Supplier "${updatedItems.name}" สำเร็จ`,
        });
      } else {
        notify({
          type: 'error',
          message: result.message || 'เกิดข้อผิดพลาดในการบันทึก',
        });
      }
      setModalOpen(false);
      setSelectedItem(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'เกิดข้อผิดพลาดในการบันทึก';

      notify({
        type: 'error',
        message,
      });
    } finally {
      setOpenLoading(false)
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
  const columnsWithAction =
    roleCurrent !== ROLES.ADMIN && roleCurrent !== ROLES.STAFF
      ? [...columnSupplier]
      : [...columnSupplier, actionColumn];

  return (
    <Box>
      <Card shadow="sm" padding="lg">
        <Group justify="space-between" mb="sm">
          <Title order={3}>ผู้จัดหา</Title>
          <Box style={{
            display: "flex",
            gap: "10px"
          }}>
            {roleCurrent && roleCurrent !== ROLES.ADMIN || roleCurrent && roleCurrent !== ROLES.STAFF && (
              <Button
                onClick={() => {
                  setSelectedItem(null);
                  setModalType('form');
                  setModalOpen(true);
                }}
              >เพิ่มผู้จัดหา</Button>
            )}
          </Box>
        </Group>
        <DataTable columns={columnsWithAction} data={data} pageSize={10} />
      </Card>

      {modalType === 'confirm' && (
        <ConfirmModal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title="ยืนยันการลบ supplier"
          message={`คุณต้องการลบ supplier "${selectedItem?.name}" ใช่หรือไม่?`}
          onConfirm={confirmDelete}
        />
      )}

      {modalType === 'form' && (
        <FormModel<SupplierType>
          validationSchema={supplierSchema}
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title={
            selectedItem
              ? `แก้ไข supplier "${selectedItem.name}"`
              : 'เพิ่ม supplier ใหม่'
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
            { name: 'name', label: 'ชื่อผู้จัดหา', type: 'text', required: true },
            { name: 'phone', label: 'เบอร์โทร', type: 'text', required: true },
            { name: 'email', label: 'อีเมล', type: 'text', required: true },
            { name: 'address', label: 'ที่อยู่', type: 'text', required: true },
          ]}
          onSubmit={saveItems}
        />
      )}
    </Box>
  )
}

export default SupplierPage
