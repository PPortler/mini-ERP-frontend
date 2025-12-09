import { Card, Box, Title, Group, ActionIcon, Stack, Paper } from "@mantine/core";
import DataTable, { type Column } from "../../components/Table/DataTable";
import { useLoadInitialData } from "./hooks/useLoadInititalData";
import type { AuditLogType } from "../../types/auditLog";
import { parseDate } from "../../utils/getDateUtils";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import ViewModal from "../../components/Models/ViewModal";
import InfoRow from "../../components/UI/Text/InfoRow";
import { AppText } from "../../components/UI/Text/AppText";
import { AUDIT_STATUS } from "../../constants/enum/enum";
import StatusBadge from "../../components/UI/StatusBagde";

function AuditLogPage() {
  const { auditLogs, loading } = useLoadInitialData();
  const [isModalView, setIsModalView] = useState<boolean>()
  const [selectedItem, setSelectedItem] = useState<AuditLogType>()

  const OpenViewDetail = (items: AuditLogType) => {
    setSelectedItem(items);
    setIsModalView(true);
  };

  const actionColumn = {
    header: 'Detail',
    accessor: 'detail',
    cell: (row: AuditLogType) => (
      <Group gap="xs">
        <ActionIcon color="green" onClick={() => OpenViewDetail(row)}>
          <VisibilityIcon fontSize="small" />
        </ActionIcon>
      </Group>
    ),
  };

  const statusColor: Record<string, string> = {
    [AUDIT_STATUS.PENDING]: "gray",
    [AUDIT_STATUS.SUCCESS]: "green",
    [AUDIT_STATUS.FAILED]: "red",
  };
  const columnAuditLogs: Column<AuditLogType>[] = [
    {
      header: "Created At",
      accessor: "created_at",
      cell: (row: AuditLogType) => {
        const { dateString, timeString } = parseDate(row?.created_at ?? "");
        return <>{dateString}, {timeString}</>;
      }
    },
    { header: "Audit ID", accessor: "audit_log_id" },
    { header: "Username", accessor: "username" },
    { header: "Action", accessor: "action" },
    { header: "Path", accessor: "path" },
    {
      header: "Status", accessor: "status",
      cell: (row: AuditLogType) => {
        return <StatusBadge statusColor={statusColor} status={row.status} />
      }
    },

  ];

  const columnsWithAction = [...columnAuditLogs, actionColumn];

  return (
    <Box>
      <Card shadow="sm" padding="lg">
        <Title order={3} mb="md">
          Audit Logs
        </Title>

        <DataTable
          loading={loading}
          data={auditLogs}
          columns={columnsWithAction} pageSize={15}
        />
      </Card>

      {/* ViewOpen */}
      <ViewModal
        opened={!!isModalView}
        onClose={() => setIsModalView(false)}
        title="Audit Log Details"
        content={
          selectedItem ? (
            <Stack gap={3}>
              <InfoRow label="Created At" value={`${parseDate(selectedItem.created_at || "").dateString}, ${parseDate(selectedItem.created_at || "").timeString}`} />
              <InfoRow label="User ID" value={selectedItem.user_id} />
              <InfoRow label="Audit Log ID" value={selectedItem.audit_log_id} />
              <InfoRow label="User" value={selectedItem.username} />
              <InfoRow label="Action" value={selectedItem.action} />
              <InfoRow label="Path" value={selectedItem.path} />
              <InfoRow
                label="Status"
                value={<StatusBadge statusColor={statusColor} status={selectedItem.status} />}
              />

              {/* Detail */}
              <Stack gap={4}>
                <AppText fw={850}>Detail:</AppText>
                <Paper shadow="xs" p="sm" radius="md">
                  <pre style={{
                    background: "#f5f5f5",
                    padding: "10px",
                    borderRadius: "5px",
                    overflowX: "auto",
                    marginTop: "5px"
                  }}>
                    {JSON.stringify(selectedItem.detail, null, 2)}
                  </pre>
                </Paper>
              </Stack>

            </Stack>
          ) : null
        }
      />
    </Box>
  );
}

export default AuditLogPage;