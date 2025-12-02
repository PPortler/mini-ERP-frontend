import { Stack, Box, Group, Text, Divider } from "@mantine/core";
import type { PurchaseOrderType } from "../../../types/purchaes";
import type { ProductType } from "../../../types/product";

interface POConfirmMessageProps {
    po: PurchaseOrderType;
    nextStatus?: string;
}

interface PoConfirmProductType extends ProductType {
    quantity?: number;
    price?: number;
}

export const POConfirmMessage: React.FC<POConfirmMessageProps> = ({ po, nextStatus }) => {

    return (
        <Stack gap="sm">
            {/* ข้อความยืนยัน */}
            {nextStatus && (
                <Box>
                    คุณต้องการเปลี่ยนสถานะเป็น <b>{nextStatus}</b> ใช่หรือไม่?
                </Box>
            )}

            {/* ข้อมูล PO */}
            <Stack gap={2} mt="sm">
                <Group gap="apart">
                    <Text><b>PO ID:</b> {po.purchase_order_id}</Text>
                </Group>
                <Text><b>Supplier:</b> {po.supplier_name}</Text>
            </Stack>

            {/* รายการสินค้า */}
            {po.products && po.products.length > 0 && (
                <>
                    <Divider label="Products" labelPosition="center" />
                    {(po.products as PoConfirmProductType[]).map((p) => (
                        <Group justify="space-between" key={p.product_id}>
                            <Box>
                                {p.product_code}/{p.name}
                            </Box>
                            <Box>
                                {p.quantity} x {p.price?.toLocaleString()} บาท
                            </Box>
                            <Box>
                                รวม: {(p.quantity! * (p.price ?? 0)).toLocaleString()} บาท
                            </Box>
                        </Group>
                    ))}

                    {/* บรรทัดสุดท้าย ราคารวมทั้งหมด */}
                    <Group justify="space-between" mt="sm">
                        <Box><b>Total Amount:</b></Box>
                        <Box>{po.total_amount} บาท</Box>
                    </Group>

                </>
            )}
        </Stack>
    );
};