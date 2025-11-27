import { ActionIcon, Box, Button, Card, Group, Title } from '@mantine/core'
import DataTable from '../../components/Table/DataTable'
import DownloadIcon from '@mui/icons-material/Download';
import { useLoadInitialData } from './hooks/useLoadInitialData';
import { columnMinStock } from '../../constants/columnTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getRoleCurrent } from '../../utils/RoleUtil';
import { ROLES } from '../../constants/enum/enum';
import { useState } from 'react';
import type { ProductType } from '../../types/product';
import FormModel from '../../components/Models/FormModel';
import ConfirmModal from '../../components/Models/ConfirmModel';
import { ProductService } from '../../services/ProductService';
import { notify } from '../../utils/Notify';

function ProductPage() {
  const { products, categories, refetch } = useLoadInitialData();
  const roleCurrent = getRoleCurrent();

  // State สำหรับ modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'confirm' | 'form'>('confirm');
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  const categoryOptions = categories.map(c => ({
    label: c.name,
    value: c.category_id.toString()
  }));

  // เปิด modal confirm delete
  const handleDelete = (product: ProductType) => {
    setSelectedProduct(product);
    setModalType('confirm');
    setModalOpen(true);
  };

  // เปิด modal edit
  const handleEdit = (product: ProductType) => {
    setSelectedProduct(product);
    setModalType('form');
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct?.product_id) return;
    try {
      const res = await ProductService.delete(selectedProduct.product_id)

      if (!res.ok) {
        notify({
          type: 'error',
          message: res.message || 'เกิดข้อผิดพลาดลบไม่สำเร็จ',
        });
        return;
      }
      notify({
        type: 'success',
        message: 'ลบสินค้าสำเร็จ',
      });
      refetch();
    } catch (err: any) {
      notify({
        type: "error",
        message: err.message || 'เกิดข้อผิดพลาดลบไม่สำเร็จ',
      })
    }
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const saveItems = async (updatedProduct: ProductType) => {
    try {
      let result;
      if (!updatedProduct.product_id) {
        result = await ProductService.create({
          name: updatedProduct.name,
          cost_price: updatedProduct.cost_price,
          selling_price: updatedProduct.selling_price,
          min_stock: updatedProduct.min_stock,
          unit: updatedProduct.unit,
          category_id: updatedProduct.category_id,
          stock: updatedProduct.stock,
        });
      } else {
        result = await ProductService.update(updatedProduct.product_id, updatedProduct);
      }

      if (result.ok && result.data.length > 0) {
        notify({
          type: 'success',
          message: updatedProduct.product_id
            ? `แก้ไขสินค้า "${updatedProduct.name}" สำเร็จ`
            : `เพิ่มสินค้า "${updatedProduct.name}" สำเร็จ`,
        });
        refetch();
      } else {
        notify({
          type: 'error',
          message: result.message || 'เกิดข้อผิดพลาดในการบันทึกสินค้า',
        });
      }
      setModalOpen(false);
      setSelectedProduct(null);
    } catch (error: any) {
      notify({
        type: 'error',
        message: error.message || 'เกิดข้อผิดพลาดในการบันทึกสินค้า',
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
      ? [...columnMinStock]
      : [...columnMinStock, actionColumn];

  return (
    <Box>
      <Card shadow="sm" padding="lg">
        <Group justify="space-between" mb="sm">
          <Title order={3}>สินค้าทั้งหมด</Title>
          <Box style={{
            display: "flex",
            gap: "10px"
          }}>
            {roleCurrent && roleCurrent !== ROLES.ADMIN || roleCurrent && roleCurrent !== ROLES.STAFF && (
              <Button
                onClick={() => {
                  setSelectedProduct(null);
                  setModalType('form');
                  setModalOpen(true);
                }}
              >เพิ่มสินค้า</Button>
            )}
            {/* <Button leftSection={<DownloadIcon />}>Export Excel</Button> */}
          </Box>
        </Group>
        <DataTable columns={columnsWithAction} data={products} pageSize={10} />
      </Card>

      {modalType === 'confirm' && (
        <ConfirmModal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title="ยืนยันการลบสินค้า"
          message={`คุณต้องการลบสินค้า "${selectedProduct?.name}" ใช่หรือไม่?`}
          onConfirm={confirmDelete}
        />
      )}

      {modalType === 'form' && (
        <FormModel<ProductType>
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title={
            selectedProduct
              ? `แก้ไขสินค้า "${selectedProduct.name}"`
              : 'เพิ่มสินค้าใหม่'
          }
          initialValues={
            selectedProduct || {
              product_id: '',
              name: '',
              cost_price: 0,
              selling_price: 0,
              min_stock: 0,
              unit: 0,
              category_id: '',
              stock: 0,
            }
          }
          fields={[
            { name: 'name', label: 'ชื่อสินค้า', type: 'text' },
            { name: 'cost_price', label: 'ราคาทุน', type: 'number' },
            { name: 'selling_price', label: 'ราคาขาย', type: 'number' },
            { name: 'min_stock', label: 'Min Stock', type: 'number' },
            { name: 'unit', label: 'หน่วย', type: 'number' },
            {
              name: "category_id",
              label: "หมวดหมู่",
              type: "select",
              options: categoryOptions,
            },
          ]}
          onSubmit={saveItems}
        />
      )}
    </Box>
  )
}

export default ProductPage
