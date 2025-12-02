import { Card, Grid, Text, Group, Title } from "@mantine/core";
import DataTable from "../../components/Table/DataTable";
import { columnProducts } from "../../constants/columnTable";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

export default function Dashboard() {
  const { minStock, stockMovement, purchaseTrend, loading } = useLoadInitialData();

  // Chart options
  const stockMovementOptions: ApexOptions = {
    chart: { id: "stock-movement", toolbar: { show: false } },
    xaxis: { categories: stockMovement.map((item) => item.productName) },
    title: { text: "Stock Movement", align: "center" },
  };
  const purchaseTrendOptions: ApexOptions = {
    chart: { id: "purchase-trend", toolbar: { show: false } },
    xaxis: { categories: purchaseTrend.map((item) => item.date), },
    title: { text: "Purchase Trend", align: "center" },
  };

  return (
    <Grid gutter="lg">
      {/* ----------------------------------------------------
          1) Summary Cards
      ---------------------------------------------------- */}
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card shadow="sm" padding="lg">
          <Text size="sm" c="dimmed">มูลค่าสินค้าคงคลังรวม</Text>
          <Title order={2}>฿ 152,400</Title>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card shadow="sm" padding="lg">
          <Text size="sm" c="dimmed">สินค้าใกล้หมด</Text>
          <Title order={2}>{minStock.length} รายการ</Title>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card shadow="sm" padding="lg">
          <Text size="sm" c="dimmed">ยอด PO ทั้งหมด</Text>
          <Title order={2}>48 PO</Title>
        </Card>
      </Grid.Col>

      {/* ----------------------------------------------------
          2) Charts
      ---------------------------------------------------- */}
      <Grid.Col span={{ base: 12, sm: 6, md: 6 }}>
        <Card shadow="sm" padding="lg">
          <Group justify="space-between" mb="sm">
            <Title order={3}>Stock Movement</Title>
          </Group>
          <Chart
            options={stockMovementOptions}
            series={[{ name: "Stock", data: stockMovement.map((i) => i.quantity) }]}
            type="bar"
            height={300}
          />
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6, md: 6 }}>
        <Card shadow="sm" padding="lg">
          <Group justify="space-between" mb="sm">
            <Title order={3}>Purchase Trend</Title>
          </Group>
          <Chart
            options={purchaseTrendOptions}
            series={[{ name: "PO", data: purchaseTrend.map((i) => i.count) }]}
            type="line"
            height={300}
          />
        </Card>
      </Grid.Col>

      {/* ----------------------------------------------------
          3) Low Stock Warning Table
      ---------------------------------------------------- */}
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg">
          <Group justify="space-between" mb="sm">
            <Title order={3}>สินค้าใกล้หมด (ต่ำกว่า Min Stock)</Title>
          </Group>
          <DataTable loading={loading} columns={columnProducts} data={minStock} pageSize={5} />
        </Card>
      </Grid.Col>
    </Grid>
  );
}