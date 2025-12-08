import { Stack, Box, Group, Text, Divider } from "@mantine/core";
import type { PurchaseOrderType } from "../../../types/purchaes";
import type { ProductType } from "../../../types/product";

interface POConfirmMessageProps {
    po: PurchaseOrderType;
    nextStatus?: string;
}

interface PoConfirmProductType {
    quantity?: number;
    product?: ProductType
    price?: number;
}

export const POConfirmMessage: React.FC<POConfirmMessageProps> = ({ po, nextStatus }) => {
    return (
        <Stack gap="sm">
            {/* ข้อความยืนยัน */}
            {nextStatus && (
                <Box>
                    Do you want to change status to <b>{nextStatus}</b> ?
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
            {po.purchase_order_items && po.purchase_order_items.length > 0 && (
                <>
                    <Divider label="Products" labelPosition="center" />
                    {(po.purchase_order_items as PoConfirmProductType[]).map((p) => (
                        <Group justify="space-between" key={p.product?.product_id}>
                            <Box>
                                {p.product?.product_code}/{p.product?.name}
                            </Box>
                            <Box>
                                {p.quantity} x {p.price?.toLocaleString()} Bath
                            </Box>
                            <Box>
                                {(p.quantity! * (p.price ?? 0)).toLocaleString()} Bath
                            </Box>
                        </Group>
                    ))}

                    {/* บรรทัดสุดท้าย ราคารวมทั้งหมด */}
                    {/* <Group justify="space-between" mt="sm">
                        <Box><b>Total Amount:</b></Box>
                        <Box>{po.total_amount} Bath</Box>
                    </Group> */}

                </>
            )}
        </Stack>
    );
};