import { Badge, Box, Card, Divider, Group, Stack, Text } from '@mantine/core'
import { useLoadInitialData } from './hooks/useLoadInitialData'
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
function StockProductPage() {
    const { loading, product: response } = useLoadInitialData()

    const product = response?.product;
    const stock = response?.stock_summary;
    const isLowStock = response?.is_low_stock;

    return (
        <Box>
            <Card shadow="sm" padding="lg">


                <Stack gap="md">

                    {/* Header */}
                    <Group justify="space-between">
                        <Box>
                            <Text fw={700} fz="xl">
                                {product?.name}
                            </Text>
                            <Text color="dimmed">Product Code: {product?.product_code}</Text>
                        </Box>

                        {isLowStock ? (
                            <Badge
                                color="red"
                                size="lg"
                                leftSection={<WarningAmberIcon fontSize="small" />}
                            >
                                Low Stock
                            </Badge>
                        ) : (
                            <Badge
                                color="green"
                                size="lg"
                                leftSection={<CheckCircleIcon fontSize="small" />}
                            >
                                In Stock
                            </Badge>
                        )}
                    </Group>

                    <Divider />

                    {/* Product Details */}
                    <Box>
                        <Text fw={600} mb={6}>Product Details</Text>
                        <Text>Category: <b>{product?.category?.name}</b></Text>
                        <Text>Unit: <b>{product?.unit}</b></Text>
                        <Text>Created At: <b>{product?.created_at}</b></Text>
                        <Text>Updated At: <b>{product?.updated_at}</b></Text>
                    </Box>

                    <Divider />

                    {/* Pricing */}
                    <Box>
                        <Text fw={600} mb={6}>Pricing</Text>
                        <Text>Cost Price: <b>{product?.cost_price} THB</b></Text>
                        <Text>Selling Price: <b>{product?.selling_price} THB</b></Text>
                    </Box>

                    <Divider />

                    {/* Stock Summary */}
                    <Box>
                        <Text fw={600} mb={10}>Stock Summary</Text>
                        <Text>Current Stock: <b>{stock?.current_stock}</b></Text>
                        <Text>Total Stock In: <b>{stock?.total_in}</b></Text>
                        <Text>Total Stock Out: <b>{stock?.total_out}</b></Text>
                        <Text>Total Adjustments: <b>{stock?.total_adjust}</b></Text>
                        <Text>Minimum Stock: <b>{product?.min_stock}</b></Text>
                    </Box>
                </Stack>
            </Card>
        </Box>
    )
}

export default StockProductPage
