import { Box, Button, Card, Group, Title } from '@mantine/core';
import { useLoadInitialData } from './hooks/useLoadInitialData';
import { useState } from 'react';
import type { ProductType } from '../../types/product';
import type { StockTransactionType } from '../../types/stockTransection';
import FormModel from '../../components/Models/FormModel';
import { TYPE_STOCK_TRANSECTION } from '../../constants/enum/enum';
import { useNavigate } from 'react-router-dom';
import { StockService } from '../../services/StockService';
import { notify } from '../../utils/Notify';
import StockTable from '../../components/Table/StockTable';

function StockPage() {
    const { products, refetch } = useLoadInitialData(); // ต้องดึง transactions ด้วย
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
    const [transactionType, setTransactionType] = useState<string>(TYPE_STOCK_TRANSECTION.IN);

    const productsWithStock = products;

    const handleTransaction = (product: ProductType, type: string) => {
        setSelectedProduct(product);
        setTransactionType(type);
        setModalOpen(true);
    };

    const saveTransaction = async (values: StockTransactionType) => {
        if (values.type === TYPE_STOCK_TRANSECTION.OUT) {
            const currentStock = productsWithStock.find(p => p.product_id === values.product_id)?.stock || 0;
            if (values.quantity > currentStock) {
                alert('จำนวนเบิกเกินสต็อก');
                return;
            }
        }
        const res = await StockService.create({
            product_id: values.product_id,
            type: values.type,
            quantity: values.quantity,
            reason: values.reason,
            reference: values.reference,
        });
        if (res.ok) {
            notify({
                type: "success",
                message: "ทำรายการสำเร็จ"
            })
            refetch();
        } else {
            notify({
                type: "error",
                message: "เกิดข้อผิดพลาด"
            })
        }
        setModalOpen(false);
        setSelectedProduct(null);
    };

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group justify="space-between" mb="sm">
                    <Title order={3}>สต็อกสินค้า</Title>
                    <Button onClick={() => navigate("/stock/transactions")}>
                        ดูประวัติรายการสต็อก
                    </Button>
                </Group>
                <StockTable
                    products={productsWithStock}
                    onTransaction={handleTransaction} // ถ้าไม่ส่ง มันจะเป็น read-only
                />
            </Card>

            {modalOpen && selectedProduct && (
                <FormModel<StockTransactionType>
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={`${transactionType} สินค้า "${selectedProduct.name}"`}
                    initialValues={{
                        stock_transaction_id: '',
                        product_id: selectedProduct.product_id,
                        type: transactionType,
                        quantity: 0,
                        reason: '',
                        reference: '',
                        created_at: new Date().toISOString(),
                    }}
                    fields={[

                        { name: 'quantity', label: 'จำนวน', type: 'number' },
                        ...(transactionType === 'ADJUST'
                            ? [{ name: 'reason', label: 'สาเหตุ', type: 'textarea' }]
                            : []),
                    ]}
                    onSubmit={saveTransaction}
                />
            )}
        </Box>
    );
}

export default StockPage;