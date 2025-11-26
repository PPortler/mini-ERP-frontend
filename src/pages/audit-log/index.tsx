import { Card, Box, Title } from "@mantine/core";
import DataTable from "../../components/Table/DataTable";
import { useLoadInitialData } from "./hooks/useLoadInititalData";

function AuditLogPage() {
  const { auditLogs } = useLoadInitialData();

  const columns = [
    { header: "Audit ID", accessor: "audit_log_id" },
    { header: "User ID", accessor: "user_id" },
    { header: "Action", accessor: "action" },
    {
      header: "Detail",
      accessor: "detail",
      cell: (row: any) => (
        <pre style={{ margin: 0, fontSize: "12px" }}>
          {JSON.stringify(row.detail, null, 2)}
        </pre>
      ),
    },
    {
      header: "Created At",
      accessor: "created_at",
      cell: (row: any) => new Date(row.created_at).toLocaleString(),
    },
  ];

  return (
    <Box>
      <Card shadow="sm" padding="lg">
        <Title order={3} mb="md">
          Audit Logs
        </Title>

        <DataTable data={auditLogs} columns={columns} pageSize={15} />
      </Card>
    </Box>
  );
}

export default AuditLogPage;