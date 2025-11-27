import { Table, Pagination, Box, Text, Center, Paper } from "@mantine/core";
import { useState } from "react";

export type Column = {
  header: string;
  accessor: string;
  cell?: (row: any) => React.ReactNode;
};

type DataTableProps = {
  columns: Column[];
  data: any[];
  pageSize?: number;
  emptyText?: string;
};

export default function DataTable({
  columns,
  data,
  pageSize = 5,
  emptyText = "ไม่พบข้อมูล",
}: DataTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = data.slice(start, end);

  const isEmpty = data.length === 0;

  return (
    <Box>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => (
              <Table.Th key={col.accessor}>{col.header}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {isEmpty ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length}>
                <Center py="xl">
                  <Box
                    style={{
                      width: "100%",
                      textAlign: "center",
                      padding: "24px 16px",
                      borderRadius: "8px",
                    }}
                  >
                    <Text c="dimmed" fw={500} fz="sm">
                      {emptyText}
                    </Text>
                  </Box>
                </Center>
              </Table.Td>
            </Table.Tr>
          ) : (
            paginatedData.map((row, i) => (
              <Table.Tr key={i}>
                {columns.map((col) => (
                  <Table.Td key={col.accessor}>
                    {col.cell ? col.cell(row) : row[col.accessor] ?? "-"}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      {!isEmpty && (
        <Pagination
          total={totalPages}
          value={page}
          onChange={setPage}
          mt="md"
          radius="sm"
        />
      )}
    </Box>
  );
}