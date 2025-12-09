import { ActionIcon, Box, Card, Group, Title } from '@mantine/core'
import DataTable, { type Column } from '../../components/Table/DataTable'
import { useLoadInitialData } from './hooks/useLoadInitialData';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import { productSchema } from '../../schemas/productSchema';
import { loadingActions } from '../../stores/loadingStore';
import { useNavigate } from 'react-router-dom';

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
    loading,
    setSortOrder,
    setSortField,
    sortField,
    sortOrder
  } = useLoadInitialData();

  const navigate = useNavigate();
  const roleCurrent = getRoleCurrent();

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

  // เปิด modal edit
  const handleNavigateToStock = (id: string) => {
    navigate(`/products/stock?poid=${id}`)
  };

  const confirmDelete = async () => {
    loadingActions.show();

    if (!selectedProduct?.product_id) return;
    try {
      const res = await ProductService.delete(selectedProduct.product_id)

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
      setSelectedProduct(null);
      setModalOpen(false);
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

  const saveItems = async (updatedProduct: ProductType) => {
    loadingActions.show();

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
        setSelectedProduct(null);
        notify({
          type: 'success',
          message: updatedProduct.product_id
            ? `Edit Product "${updatedProduct.name}" Successfully`
            : `Create Produuct "${updatedProduct.name}" Successfully`,
        });
        setModalOpen(false);
        refetch();
      } else {
        notify({
          type: 'error',
          message: result.message,
        });
      }

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
    cell: (row: ProductType) => (
      <Group gap="xs">
        {/* ปุ่ม view ทุก role สามารถเห็น */}
        <ActionIcon color="green" onClick={() => handleNavigateToStock(row.product_id)}>
          <VisibilityIcon fontSize="small" />
        </ActionIcon>
        {/* ปุ่ม edit/delete เฉพาะ admin หรือ staff */}
        {(roleCurrent === ROLES.ADMIN || roleCurrent === ROLES.STAFF) && (
          <>
            <ActionIcon color="blue" onClick={() => handleEdit(row)}>
              <EditIcon fontSize="small" />
            </ActionIcon>
            <ActionIcon color="red" onClick={() => handleDelete(row)}>
              <DeleteIcon fontSize="small" />
            </ActionIcon>
          </>
        )}
      </Group>
    ),
  };

  const columnProducts: Column<ProductType>[] = [
    { header: "Product Code", accessor: "product_code" },
    { header: "Product Name", accessor: "name" },
    { header: "Unit", accessor: "unit" },
    { header: "Cost Price", accessor: "cost_price" },
    { header: "Selling Price", accessor: "selling_price" },
    {
      header: "Categoty", accessor: "category_name",
    },
    { header: "Min Stock", accessor: "min_stock" },
  ];

  const columnsWithAction = [...columnProducts, actionColumn];

  return (
    <Box>
      <Card shadow="sm" padding="lg">
        <Group justify="space-between" mb="sm">
          <Title order={3}>Products</Title>
        </Group>
        <Group justify="space-between">
          <FilterInputs
            fields={[
              {
                key: "search",
                label: "Search",
                placeholder: "code or product name",
                type: "text",
                value: search,
                onChange: setSearch,
              },
              {
                key: "categoryId",
                label: "Category",
                type: "select",
                value: categoryId,
                options: categoryOptions,
                onChange: setCategoryId,
              },
            ]}
          />
          {(roleCurrent === ROLES.ADMIN || roleCurrent === ROLES.STAFF) && (
            <AppButton
              loading={loading}
              onClick={() => {
                setSelectedProduct(null);
                setModalType('form');
                setModalOpen(true);
              }}
            >
              Create Product
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
          setSortOrder={setSortOrder}
          setSortField={setSortField}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      </Card>

      <ConfirmModal
        opened={modalType === 'confirm' && modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Delete Product"
        message={`Do you want to delete product: "${selectedProduct?.name}" ?`}
        onConfirm={confirmDelete}
      />
      <FormModel<ProductType>
        validationSchema={productSchema}
        opened={modalType === 'form' && modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          selectedProduct
            ? `Edit Product: "${selectedProduct.name}"`
            : 'Crteate New Product'
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
          { name: 'product_code', label: 'Product Code', type: 'text', required: true, disabled: !!selectedProduct },
          { name: 'name', label: 'Product Name', type: 'text', required: true },
          { name: 'cost_price', label: 'Cost Price', type: 'number', required: true },
          { name: 'selling_price', label: 'Selling Price', type: 'number', required: true },
          { name: 'min_stock', label: 'Min Stock', type: 'number', required: true },
          { name: 'unit', label: 'Unit', type: 'string', required: true },
          {
            name: "category_id",
            label: "Category",
            type: "select",
            disabled: !!selectedProduct,
            options: categoryOptions,
            required: true
          },
        ]}
        onSubmit={saveItems}
      />

    </Box>
  )
}

export default ProductPage
