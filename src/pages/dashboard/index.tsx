import { Card, Grid, Text, Group, Title, Button } from "@mantine/core";
import DownloadIcon from '@mui/icons-material/Download';
import DataTable from "../../components/Table/DataTable";
import { columnMinStock, poColumns, receivingColumns, withdrawColumns } from "../../constants/columnTable";
import { useLoadInitialData } from "./hooks/useLoadInitialData";

export default function Dashboard() {

  const { minStock } = useLoadInitialData();

  const receivingData = [
    { month: "มกราคม 2025", received_count: 18, total_amount: 42500 },
    { month: "กุมภาพันธ์ 2025", received_count: 22, total_amount: 51300 },
    { month: "มีนาคม 2025", received_count: 15, total_amount: 36900 },
  ];

  const withdrawData = [
    { date: "2025-11-24", created_by: "สมชาย", item: "กล่อง 20x20", quantity: 12 },
    { date: "2025-11-23", created_by: "มานี", item: "ปากกาเจล", quantity: 20 },
  ];

  const poData = [
    { po_number: "PO-00123", vendor: "ABC Supplies", total_amount: 24000 },
    { po_number: "PO-00121", vendor: "XYZ Trading", total_amount: 12500 },
  ];

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
          <Title order={2}>8 รายการ</Title>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card shadow="sm" padding="lg">
          <Text size="sm" c="dimmed">ยอด PO ทั้งหมด</Text>
          <Title order={2}>48 PO</Title>
        </Card>
      </Grid.Col>

      {/* ----------------------------------------------------
          2) สินค้าใกล้หมด
      ---------------------------------------------------- */}
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg">
          <Group justify="space-between" mb="sm">
            <Title order={3}>สินค้าใกล้หมด (ต่ำกว่า Min Stock)</Title>
            {/* <Button leftSection={<DownloadIcon />}>Export Excel</Button> */}
          </Group>
          <DataTable columns={columnMinStock} data={minStock} pageSize={5} />
        </Card>
      </Grid.Col>

      {/* ----------------------------------------------------
          3) รายงานการรับสินค้า (รายเดือน / Chart)
      ---------------------------------------------------- */}
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg">
          <Group justify="space-between" mb="sm">
            <Title order={3}>รายงานการรับสินค้า (รายเดือน)</Title>
            {/* <Button leftSection={<DownloadIcon />}>Export Excel</Button> */}
          </Group>

          <DataTable
            columns={receivingColumns}
            data={receivingData}
            pageSize={5}
          />
        </Card>
      </Grid.Col>

      {/* ----------------------------------------------------
          4) ประวัติการเบิกสินค้า
      ---------------------------------------------------- */}
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg">
          <Group justify="space-between" mb="sm">
            <Title order={3}>ประวัติการเบิกสินค้า</Title>
            {/* <Button leftSection={<DownloadIcon />}>Export Excel</Button> */}
          </Group>

          <DataTable
            columns={withdrawColumns}
            data={withdrawData}
            pageSize={5}
          />
        </Card>
      </Grid.Col>

      {/* ----------------------------------------------------
          5) สรุปยอด PO
      ---------------------------------------------------- */}
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg">
          <Group justify="space-between" mb="sm">
            <Title order={3}>สรุปยอด PO</Title>
            {/* <Button leftSection={<DownloadIcon />}>Export Excel</Button> */}
          </Group>

          <DataTable
            columns={poColumns}
            data={poData}
            pageSize={5}
          />
        </Card>
      </Grid.Col>
    </Grid>
  );
}