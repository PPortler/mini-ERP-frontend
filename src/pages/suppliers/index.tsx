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

function SupplierPage() {
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
    } catch (err: any) {
      notify({
        type: "error",
        message: err.message || 'เกิดข้อผิดพลาดลบไม่สำเร็จ',
      })
    }
    setModalOpen(false);
    setSelectedItem(null);
  };

  const saveItems = async (updatedItems: SupplierType) => {
    try {
      let result;
      if (!updatedItems.supplier_id) {
        result = await SupplierService.create({
          name: updatedItems.name,
          phone: updatedItems.phone,
          email: updatedItems.email,
          address: updatedItems.address
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
    } catch (error: any) {
      notify({
        type: 'error',
        message: error.message || 'เกิดข้อผิดพลาดในการบันทึก',
      });
    }
  };

  const actionColumn = {
    header: 'Action',
    accessor: 'action',
    cell: (row: any) => (
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
            {/* <Button leftSection={<DownloadIcon />}>Export Excel</Button> */}
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
            { name: 'name', label: 'ชื่อผู้จัดหา', type: 'text' },
            { name: 'phone', label: 'เบอร์โทร', type: 'text' },
            { name: 'email', label: 'อีเมล', type: 'text' },
            { name: 'address', label: 'ที่อยู่', type: 'text' },
          ]}
          onSubmit={saveItems}
        />
      )}
    </Box>
  )
}

export default SupplierPage
