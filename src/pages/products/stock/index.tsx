import { Badge, Box, Card, Divider, Grid, Group, Stack, Text } from '@mantine/core'
import { useLoadInitialData } from './hooks/useLoadInitialData'
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { parseDate } from '../../../utils/getDateUtils';
import { Skeleton } from "@mantine/core";
import { SummaryCard } from '../../../components/UI/SummaryCard';
import ChartWrapper from '../../../components/Polish/ChartWrapper';
import type { ApexOptions } from "apexcharts";
import { useStockMovement } from './hooks/useStockMovement';
import { InfoCard } from './components/InfoCard';

function StockProductPage() {

    const searchParams = new URLSearchParams(location.search);
    const productId = searchParams.get("poid");
    const { loading, product: response } = useLoadInitialData(productId || "")
    const { movement } = useStockMovement(
        productId || "",
        response?.stock_summary
    );

    const navigate = useNavigate();
    const product = response?.product;
    const stock = response?.stock_summary;
    const isLowStock = response?.is_low_stock;

    const parseDateCreate = parseDate(product?.created_at || "")
    const parseDateUpdate = parseDate(product?.updated_at || "")

    // Chart options
    const stockMovementOptions = (categories: string[]): ApexOptions => ({
        chart: {
            id: "stock-movement",
            toolbar: { show: false },
        },
        xaxis: { categories },
        title: {
            text: `Stock Movement: ${product?.name} `,
            align: "center",
        },
    });

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Stack gap="md">

                    {/* Header */}
                    <Group justify="space-between">
                        <IconButton
                            onClick={() => navigate(-1)}
                            size="medium"
                            color="primary"
                            aria-label="back"
                        >
                            <ArrowBackIcon />
                        </IconButton>

                        <Box style={{ flex: 1 }}>
                            {loading ? (
                                <>
                                    <Skeleton height={28} width="40%" radius="sm" />
                                    <Skeleton height={20} width="30%" mt={6} radius="sm" />
                                </>
                            ) : (
                                <>
                                    <Text fw={700} fz="xl">{product?.name}</Text>
                                    <Text color="dimmed">Product Code: {product?.product_code}</Text>
                                </>
                            )}
                        </Box>

                        {!loading && (
                            isLowStock ? (
                                <Badge color="red" size="lg" leftSection={<WarningAmberIcon fontSize="small" />}>
                                    Low Stock
                                </Badge>
                            ) : (
                                <Badge color="green" size="lg" leftSection={<CheckCircleIcon fontSize="small" />}>
                                    In Stock
                                </Badge>
                            )
                        )}

                        {loading && (
                            <Skeleton height={32} width={100} radius="lg" />
                        )}
                    </Group>
                    <Divider />
                    <Box>
                        <InfoCard
                            loading={loading}
                            title="Product Info"
                            titleColor="#1D4E89"
                            bgColor="#E8F1FA"
                            items={[
                                { label: 'Name', value: product?.name },
                                { label: 'Code', value: product?.product_code },
                                { label: 'Category', value: product?.category?.name },
                                { label: 'Unit', value: product?.unit },
                            ]}
                        />
                        <InfoCard
                            loading={loading}
                            title="Stock Info"
                            titleColor="#D9822B"
                            bgColor="#FFF4E6"
                            items={[
                                { label: 'Minimum Stock', value: product?.min_stock },
                                { label: 'Current Stock', value: stock?.current_stock },
                                { label: 'In Stock', value: stock?.total_in },
                                { label: 'Out Stock', value: stock?.total_out },
                                { label: 'Adjust Stock', value: stock?.total_adjust },
                            ]}
                        />
                        <InfoCard
                            loading={loading}
                            title="Dates"
                            titleColor="#2E7D32"
                            bgColor="#E8F5E9"
                            items={[
                                { label: 'Updated Latest', value: `${parseDateUpdate.dateString}, ${parseDateUpdate.timeString}` },
                                { label: 'Created At', value: `${parseDateCreate.dateString}, ${parseDateCreate.timeString}` },
                            ]}
                        />
                    </Box>
                    <Divider />

                    {/* Product Details */}
                    <Grid>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <SummaryCard
                                label="Current Stock"
                                value={`${stock?.current_stock}`}
                                loading={loading}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <SummaryCard
                                label="Cost Price"
                                value={`${product?.cost_price} ฿`}
                                loading={loading}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <SummaryCard
                                label="Selling Price"
                                value={`${product?.selling_price} ฿`}
                                loading={loading}
                            />
                        </Grid.Col>
                    </Grid>

                    {/* Stock Summary */}
                    <Grid>
                        <Grid.Col span={{ base: 12 }}>
                            <ChartWrapper
                                options={stockMovementOptions(movement.categories)}
                                series={movement.series}
                                type="line"
                                height={300}
                                loading={loading}
                                cardTitle="Stock Movement"
                            />
                        </Grid.Col>
                    </Grid>
                    {/* <Box>
                        <Text fw={600} mb={10}>Stock Summary</Text>

                        {loading ? (
                            <>
                                <Skeleton height={18} width="40%" mb={6} />
                                <Skeleton height={18} width="40%" mb={6} />
                                <Skeleton height={18} width="40%" mb={6} />
                                <Skeleton height={18} width="40%" />
                            </>
                        ) : (
                            <>
                                <Text>Current Stock: <b>{stock?.current_stock}</b></Text>
                                <Text>Total Stock In: <b>{stock?.total_in}</b></Text>
                                <Text>Total Stock Out: <b>{stock?.total_out}</b></Text>
                                <Text>Total Adjustments: <b>{stock?.total_adjust}</b></Text>
                         
                            </>
                        )}
                    </Box> */}
                </Stack>
            </Card>
        </Box>
    )
}

export default StockProductPage
