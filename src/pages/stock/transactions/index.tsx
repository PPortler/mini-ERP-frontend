import { Box, Card, Group, Title } from "@mantine/core";
import { useLoadInitialData } from "../hooks/useLoadInitialData";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StockTransactionsTable from "../../../components/Table/StockTransactionsTable";

export default function StockTransactionsPage() {
    const navigate = useNavigate()
    const { stockTransactions, products } = useLoadInitialData();

    return (
        <Box>
            <Card shadow="sm" padding="lg">
                <Group justify="space-between" mb="sm">
                    <Group>
                        <IconButton
                            onClick={() => navigate(-1)}
                            size="medium"
                            color="primary"
                            aria-label="back"
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Title order={3}>ประวัติรายการสต็อก</Title>
                    </Group>
                </Group>
                <StockTransactionsTable transactions={stockTransactions} products={products} />
            </Card>
        </Box>
    );
}