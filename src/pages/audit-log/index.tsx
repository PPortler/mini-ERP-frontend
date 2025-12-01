import { Card, Box, Title } from "@mantine/core";
import DataTable from "../../components/Table/DataTable";
import { useLoadInitialData } from "./hooks/useLoadInititalData";
import { columnAuditLogs } from "../../constants/columnTable";

function AuditLogPage() {
  const { auditLogs } = useLoadInitialData();

  return (
    <Box>
      <Card shadow="sm" padding="lg">
        <Title order={3} mb="md">
          Audit Logs
        </Title>

        <DataTable data={auditLogs} columns={columnAuditLogs} pageSize={15} />
      </Card>
    </Box>
  );
}

export default AuditLogPage;