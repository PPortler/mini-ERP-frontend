import { Card, Box, Title } from "@mantine/core";
import DataTable, { type Column } from "../../components/Table/DataTable";
import { useLoadInitialData } from "./hooks/useLoadInititalData";
import type { AuditLogType } from "../../types/auditLog";
import { parseDate } from "../../utils/getDateUtils";

function AuditLogPage() {
  const { auditLogs, loading } = useLoadInitialData();

  const columnAuditLogs: Column<AuditLogType>[] = [
     {
      header: "Created At",
      accessor: "created_at",
      cell: (row: AuditLogType) => {
        const {dateString, timeString} = parseDate(row?.created_at ?? "");
        return <>{dateString}, {timeString}</>;
      }
    },
    { header: "Audit ID", accessor: "audit_log_id" },
    { header: "User ID", accessor: "user_id" },
    { header: "Action", accessor: "action" },
    {
      header: "Detail",
      accessor: "detail",
      cell: (row: AuditLogType) => {
        return <>{JSON.stringify(row.detail, null, 2)}</>
      }
    },
   
  ];
  return (
    <Box>
      <Card shadow="sm" padding="lg">
        <Title order={3} mb="md">
          Audit Logs
        </Title>

        <DataTable loading={loading} data={auditLogs} columns={columnAuditLogs} pageSize={15} />
      </Card>
    </Box>
  );
}

export default AuditLogPage;