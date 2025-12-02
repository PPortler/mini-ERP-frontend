import { ActionIcon, Box, Card, Group, Title } from '@mantine/core'
import DataTable from '../../components/Table/DataTable'
import { useLoadInitialData } from './hooks/useLoadInitialData';
import { columnProducts } from '../../constants/columnTable';
import EditIcon from '@mui/icons-material/Edit';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { getRoleCurrent } from '../../utils/RoleUtil';
import { ROLES } from '../../constants/enum/enum';
import { useState } from 'react';
import type { ProductType } from '../../types/product';
import FormModel from '../../components/Models/FormModel';
import ConfirmModal from '../../components/Models/ConfirmModel';
import { ProductService } from '../../services/ProductService';
import { notify } from '../../utils/Notify';
import FilterInputs from '../../components/Filters/FilterSearch';
import AppButton from '../../components/Form/AppButton';
import { LoadingProvider } from '../../contexts/LoadingContext';
import { productSchema } from '../../schemas/productSchema';
// import { useNavigate } from 'react-router-dom';

function ProductPage() {
  const {
    products,
    categories,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    search,
    categoryId,
    setSearch,
    setCategoryId,
    refetch,
    loading
  } = useLoadInitialData({
    initialPage: 1,
    initialPageSize: 10,
    initialSearch: "",
    initialCategoryId: "",
  });
  // const navigate = useNavigate();
  const { setOpenLoading } = LoadingProvider.useLoading();
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

  //view
  // const handleView = (product: ProductType) => {
  //   navigate(`/products/stock?id=${product.product_id}`)
  // };

  const confirmDelete = async () => {
    setOpenLoading(true)

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
      setSelectedProduct(null);
      setModalOpen(false);
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

  const saveItems = async (updatedProduct: ProductType) => {
    setOpenLoading(true)

    try {
      let result;
      if (!updatedProduct.product_id) {
        result = await ProductService.create({
          product_code: updatedProduct.product_code,
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

      if (result.ok) {
        notify({
          type: 'success',
          message: updatedProduct.product_id
            ? `แก้ไขสินค้า "${updatedProduct.name}" สำเร็จ`
            : `เพิ่มสินค้า "${updatedProduct.name}" สำเร็จ`,
        });
        setModalOpen(false);
        setSelectedProduct(null);
        refetch();
      } else {
        notify({
          type: 'error',
          message: result.message || "เกิดข้อผิดพลาด",
        });
      }

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
    cell: (row: ProductType) => (
      <Group gap="xs">
        {/* <ActionIcon color="green" onClick={() => handleView(row)}>
          <VisibilityIcon fontSize="small" />
        </ActionIcon> */}
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
      ? [...columnProducts]
      : [...columnProducts, actionColumn];

  return (
    <Box>
      <Card shadow="sm" padding="lg">
        <Group justify="space-between" mb="sm">
          <Title order={3}>สินค้าทั้งหมด</Title>
        </Group>
        <Group justify="space-between">
          <FilterInputs
            fields={[
              {
                key: "search",
                label: "ค้นหา",
                type: "text",
                value: search,
                onChange: setSearch,
              },
              {
                key: "categoryId",
                label: "หมวดหมู่",
                type: "select",
                value: categoryId,
                options: categories.map((c) => ({ label: c.name, value: c.category_id })),
                onChange: setCategoryId,
              },
            ]}
          />
          {roleCurrent && roleCurrent !== ROLES.ADMIN || roleCurrent && roleCurrent !== ROLES.STAFF && (
            <AppButton
              loading={loading}
              onClick={() => {
                setSelectedProduct(null);
                setModalType('form');
                setModalOpen(true);
              }}
            >
              เพิ่มสินค้า
            </AppButton>
          )}
        </Group>
        <DataTable
          columns={columnsWithAction}
          data={products}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          loading={loading}
        />
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
          validationSchema={productSchema}
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
              product_code: '',
              name: '',
              cost_price: 0,
              selling_price: 0,
              min_stock: 0,
              unit: '',
              category_id: '',
              stock: 0,
            }
          }
          fields={[
            { name: 'product_code', label: 'รหัสสินค้า', type: 'text', required: true, disabled: !!selectedProduct },
            { name: 'name', label: 'ชื่อสินค้า', type: 'text', required: true },
            { name: 'cost_price', label: 'ราคาทุน', type: 'number', required: true },
            { name: 'selling_price', label: 'ราคาขาย', type: 'number', required: true },
            { name: 'min_stock', label: 'Min Stock', type: 'number', required: true },
            { name: 'unit', label: 'หน่วย', type: 'string', required: true },
            {
              name: "category_id",
              label: "หมวดหมู่",
              type: "select",
              disabled: !!selectedProduct,
              options: categoryOptions,
              required: true
            },
          ]}
          onSubmit={saveItems}
        />
      )}
    </Box>
  )
}

export default ProductPage
