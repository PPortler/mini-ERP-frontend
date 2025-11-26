import { Box, Button, Card, Group, Title } from '@mantine/core';
import DataTable from '../../components/Table/DataTable';
import { useLoadInitialData } from './hooks/useLoadInitialData';
import { useState, useMemo } from 'react';
import type { ProductType } from '../../types/product';
import type { StockTransactionType } from '../../types/stockTransection';
import FormModel from '../../components/Models/FormModel';
import { ROLES, TYPE_STOCK_TRANSECTION } from '../../constants/enum/enum';
import { getRoleCurrent } from '../../utils/RoleUtil';
import DownloadIcon from '@mui/icons-material/Download';

function StockPage() {
    const { products, stockTransactions } = useLoadInitialData(); // ต้องดึง transactions ด้วย
    const roleCurrent = getRoleCurrent();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
    const [transactionType, setTransactionType] = useState<string>(TYPE_STOCK_TRANSECTION.IN);

    // คำนวณ stock ปัจจุบันจาก transactions
    const productsWithStock = useMemo(() => {
        return products.map(product => {
            const transactions = stockTransactions.filter(t => t.product_id === product.product_id);
            const stock = transactions.reduce((acc, t) => {
                if (t.type === TYPE_STOCK_TRANSECTION.IN) return acc + t.quantity;
                if (t.type === TYPE_STOCK_TRANSECTION.OUT) return acc - t.quantity;
                if (t.type === TYPE_STOCK_TRANSECTION.ABJUST) return acc + t.quantity;
                return acc;
            }, 0);
            return { ...product, stock };
        });
    }, [products, stockTransactions]);

    const handleTransaction = (product: ProductType, type: string) => {
        setSelectedProduct(product);
        setTransactionType(type);
        setModalOpen(true);
    };

    const saveTransaction = (values: StockTransactionType) => {
        if (values.type === TYPE_STOCK_TRANSECTION.OUT) {
            const currentStock = productsWithStock.find(p => p.product_id === values.product_id)?.stock || 0;
            if (values.quantity > currentStock) {
                alert('จำนวนเบิกเกินสต็อก');
                return;
            }
        }

        console.log('Save stock transaction', values);
        setModalOpen(false);
        setSelectedProduct(null);
    };

    const actionColumn = {
        header: 'Action',
        accessor: 'action',
        cell: (row: ProductType) => (
            <Group gap="xs">
                <Button size="xs" onClick={() => handleTransaction(row, 'IN')}>รับเข้า</Button>
                <Button size="xs" onClick={() => handleTransaction(row, 'OUT')}>เบิกออก</Button>
                <Button size="xs" onClick={() => handleTransaction(row, 'ADJUST')}>ปรับยอด</Button>
            </Group>
        ),
    };

    const columnsWithAction = [
        { header: 'รหัสสินค้า', accessor: 'product_id' },
        { header: 'ชื่อสินค้า', accessor: 'name' },
        { header: 'หน่วย', accessor: 'unit' },
        { header: 'หมวดหมู่', accessor: 'category_id' },
        { header: 'Stock ปัจจุบัน', accessor: 'stock' },
        ...(roleCurrent === ROLES.ADMIN || roleCurrent === ROLES.STAFF ? [actionColumn] : [])
    ];

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group justify="space-between" mb="sm">
                    <Title order={3}>สต็อกสินค้า</Title>
                    <Button leftSection={<DownloadIcon />}>Export Excel</Button>
                </Group>

                <DataTable columns={columnsWithAction} data={productsWithStock} pageSize={10} />
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
                            ? [{ name: 'reason', label: 'เหตุผล', type: 'textarea' }]
                            : []),
                        { name: 'reference', label: 'อ้างอิง', type: 'text' },
                    ]}
                    onSubmit={saveTransaction}
                />
            )}
        </Box>
    );
}

export default StockPage;