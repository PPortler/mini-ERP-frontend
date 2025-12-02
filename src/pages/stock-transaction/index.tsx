import { Box, Card, Group, Title } from "@mantine/core";
import DataTable from "../../components/Table/DataTable";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import { columnStockTransaction } from "../../constants/columnTable";

export default function StockTransactionsPage() {
    const { stockTransactions, loading } = useLoadInitialData();

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group justify="space-between" mb="sm">
                    <Group>
                        {/* <IconButton
                            onClick={() => navigate(-1)}
                            size="medium"
                            color="primary"
                            aria-label="back"
                        >
                            <ArrowBackIcon />
                        </IconButton> */}
                        <Title order={3}>Stock Transaction</Title>
                    </Group>
                </Group>
                <DataTable loading={loading} columns={columnStockTransaction} data={stockTransactions} pageSize={10} />
            </Card>
        </Box>
    );
}

// import { Box, Button, Card, Group, Title } from '@mantine/core';
// import { useLoadInitialData } from './hooks/useLoadInitialData';
// import { useState } from 'react';
// import type { ProductType } from '../../types/product';
// import type { StockTransactionType } from '../../types/stockTransection';
// import FormModel from '../../components/Models/FormModel';
// import { ROLES, TYPE_STOCK_TRANSECTION } from '../../constants/enum/enum';
// import { useNavigate } from 'react-router-dom';
// import { StockService } from '../../services/StockService';
// import { notify } from '../../utils/Notify';
// import DataTable from '../../components/Table/DataTable';
// import { getRoleCurrent } from '../../utils/RoleUtil';

// function StockPage() {
//       const roleCurrent = getRoleCurrent();
//     const { products, refetch } = useLoadInitialData(); // ต้องดึง transactions ด้วย
//     const navigate = useNavigate();

//     const [modalOpen, setModalOpen] = useState(false);
//     const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
//     const [transactionType, setTransactionType] = useState<string>(TYPE_STOCK_TRANSECTION.IN);

//     const productsWithStock = products;

//     const handleTransaction = (product: ProductType, type: string) => {
//         setSelectedProduct(product);
//         setTransactionType(type);
//         setModalOpen(true);
//     };

//     const saveTransaction = async (values: StockTransactionType) => {
//         if (values.type === TYPE_STOCK_TRANSECTION.OUT) {
//             const currentStock = productsWithStock.find(p => p.product_id === values.product_id)?.stock || 0;
//             if (values.quantity > currentStock) {
//                 notify({
//                     type: "error",
//                     message: "จำนวนเบิกเกินสต็อก"
//                 })
//                 return;
//             }
//         }
//         const res = await StockService.create({
//             product_id: values.product_id,
//             type: values.type,
//             quantity: values.quantity,
//             reason: values.reason,
//             reference: values.reference,
//         });
//         if (res.ok) {
//             notify({
//                 type: "success",
//                 message: "ทำรายการสำเร็จ"
//             })
//             refetch();
//         } else {
//             notify({
//                 type: "error",
//                 message: "เกิดข้อผิดพลาด"
//             })
//         }
//         setModalOpen(false);
//         setSelectedProduct(null);
//     };


//     const actionColumn = {
//         header: "Action",
//         accessor: "action",
//         cell: (row: ProductType) =>
//             handleTransaction ? (
//                 <Group gap="xs">
//                     <Button size="xs" onClick={() => handleTransaction(row, TYPE_STOCK_TRANSECTION.IN)}>รับเข้า</Button>
//                     <Button size="xs" onClick={() => handleTransaction(row, TYPE_STOCK_TRANSECTION.OUT)}>เบิกออก</Button>
//                     <Button size="xs" onClick={() => handleTransaction(row, TYPE_STOCK_TRANSECTION.ADJUST)}>ปรับยอด</Button>
//                 </Group>
//             ) : null,
//     };

//     const columns = [
//         { header: "รหัสสินค้า", accessor: "product_code" },
//         { header: "ชื่อสินค้า", accessor: "name" },
//         { header: "หน่วย", accessor: "unit" },
//         // { header: "หมวดหมู่", accessor: "category_name" },
//         { header: "Stock ปัจจุบัน", accessor: "stock" },
//         ...(roleCurrent=== ROLES.ADMIN || roleCurrent === ROLES.STAFF ? [actionColumn] : []),
//     ];

//     return (
//         <Box>
//             <Card shadow="sm" padding="lg">
//                 <Group justify="space-between" mb="sm">
//                     <Title order={3}>สต็อกสินค้า</Title>
//                     <Button onClick={() => navigate("/stock/transactions")}>
//                         ดูประวัติรายการสต็อก
//                     </Button>
//                 </Group>
//                 <DataTable columns={columns} data={productsWithStock} pageSize={10} />
//             </Card>

//             {modalOpen && selectedProduct && (
//                 <FormModel<StockTransactionType>
//                     opened={modalOpen}
//                     onClose={() => setModalOpen(false)}
//                     title={`${transactionType} สินค้า "${selectedProduct.name}"`}
//                     initialValues={{
//                         stock_transaction_id: '',
//                         product_id: selectedProduct.product_id,
//                         type: transactionType,
//                         quantity: 0,
//                         reason: '',
//                         reference: '',
//                         created_at: new Date().toISOString(),
//                     }}
//                     fields={[

//                         { name: 'quantity', label: 'จำนวน', type: 'number' },
//                         { name: 'reason', label: 'สาเหตุ', type: 'textarea' },
//                         // ...(transactionType === 'ADJUST'
//                         //     ? [{ name: 'reason', label: 'สาเหตุ', type: 'textarea' }]
//                         //     : []),
//                     ]}
//                     onSubmit={saveTransaction}
//                 />
//             )}
//         </Box>
//     );
// }

// export default StockPage;