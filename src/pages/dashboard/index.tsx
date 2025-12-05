import { Card, Grid, Group, Title } from "@mantine/core";
import DataTable from "../../components/Table/DataTable";
import { useLoadInitialData } from "./hooks/useLoadInitialData";
import type { ApexOptions } from "apexcharts";
import { SummaryCard } from "./components/SummaryCard";
import { columnProducts } from "../../constants/columnTable";
import { parseDDMMYYYY, parseMonthString, toDDMMYYYY, toMMYYYY } from "../../utils/formatDate";
import AppDatePicker from "../../components/Form/AppDatePicker";
import ChartWrapper from "../../components/Polish/ChartWrapper";

export default function Dashboard() {
  const {
    lowStock,
    stockMovement,
    purchaseTrend,
    loading,
    totalInventoryValue,
    totalPo,
    totalLowStock,
    from,
    setFrom,
    to,
    setTo,
    month,
    setMonth,
    initialLoad,
    loadStockMovement,
    loadPoSummary
  } = useLoadInitialData();

  // Chart options
  const stockMovementOptions: ApexOptions = {
    chart: { id: "stock-movement", toolbar: { show: false } },
    xaxis: { categories: stockMovement.categories },
    title: { text: "Stock Movement by Day", align: "center" },
  };

  const purchaseTrendOptions: ApexOptions = {
    chart: {
      id: "purchase-trend",
      toolbar: { show: false },
    },
    stroke: { width: 3, curve: "smooth" },
    markers: { size: 4 },
    xaxis: {
      categories: purchaseTrend?.categories,
      title: { text: `${month}` }
    },
    yaxis: {
      title: { text: "Total Orders" }
    },
    legend: {
      position: "top",
      horizontalAlign: "right"
    },
    title: {
      text: "Purchase Trend",
      align: "center"
    }
  };

  return (
    <Grid gutter="lg">
      {/* ----------------------------------------------------
          1) Summary Cards
      ---------------------------------------------------- */}

      <Grid.Col span={{ base: 12, md: 4 }}>
        <SummaryCard
          label="Total Inventory Value"
          value={`฿ ${totalInventoryValue.toLocaleString()}`}
          loading={loading}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <SummaryCard
          label="Total Low Stocks"
          value={`${totalLowStock} Lists`}
          loading={loading}
        />
      </Grid.Col>


      <Grid.Col span={{ base: 12, md: 4 }}>
        <SummaryCard
          label="Total Purchase Orders"
          value={`${totalPo} Po.`}
          loading={loading}
        />
      </Grid.Col>

      {/* ----------------------------------------------------
          2) Charts
      ---------------------------------------------------- */}
      <Grid.Col span={{ base: 12, sm: 6, md: 6 }}>
        <Card shadow="sm" padding="lg">
          <Group justify="space-between" mb="sm">
            <Title order={3}>Stock Movement</Title>
          </Group>
          <Group my="sm">
            <AppDatePicker
              label="From"
              value={parseDDMMYYYY(from)}
              onChange={(newValue) => setFrom(toDDMMYYYY(newValue))}
              views={["year", "month", "day"]}
              loading={initialLoad}
            />
            <AppDatePicker
              label="To"
              value={parseDDMMYYYY(to)}
              onChange={(newValue) => setTo(toDDMMYYYY(newValue))}
              views={["year", "month", "day"]}
              loading={initialLoad}
            />
          </Group>
          <ChartWrapper
            options={stockMovementOptions}
            series={stockMovement.series}
            type="bar"
            height={300}
            loading={loadStockMovement}
            cardTitle="Stock Movement"
          />
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6, md: 6 }}>
        <Card shadow="sm" padding="lg">
          <Group justify="space-between" mb="sm">
            <Title order={3}>Purchase Trend</Title>
          </Group>
          <Group my="sm">
            <AppDatePicker
              label="Select Month"
              value={month ? parseMonthString(month) : null}
              onChange={(newValue) => setMonth(toMMYYYY(newValue))}
              views={["year", "month"]}
              loading={initialLoad}

            />
          </Group>
          <ChartWrapper
            options={purchaseTrendOptions}
            series={purchaseTrend.series}
            type="line"
            loading={loadPoSummary}
            cardTitle="Purchase Trend"
          />
        </Card>
      </Grid.Col>

      {/* ----------------------------------------------------
          3) Low Stock Warning Table
      ---------------------------------------------------- */}
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg">
          <Group justify="space-between" mb="sm">
            <Title order={3}>Low Stocks</Title>
          </Group>
          <DataTable loading={loading} columns={columnProducts} data={lowStock} pageSize={5} />
        </Card>
      </Grid.Col>
    </Grid>
  );
}