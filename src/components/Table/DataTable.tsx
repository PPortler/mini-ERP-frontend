import { Table, Pagination, Box, Text, Center, Select, Group } from "@mantine/core";
import { useState } from "react";

export type Column<T> = {
  header: string;
  accessor: string;
  cell?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  page?: number; // page ปัจจุบันจากภายนอก
  pageSize?: number;
  total?: number; // total items จาก backend
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  emptyText?: string;
};

export default function DataTable<T>({
  columns,
  data,
  page = 1,
  pageSize = 5,
  total,
  onPageChange,
  onPageSizeChange,
  emptyText = "ไม่พบข้อมูล",
}: DataTableProps<T>) {
  const [internalPage, setInternalPage] = useState(page);
  const [internalPageSize, setInternalPageSize] = useState(pageSize);

  const totalPages = total ? Math.ceil(total / internalPageSize) : Math.ceil(data.length / internalPageSize) || 1;
  const paginatedData = total ? data : data.slice((internalPage - 1) * internalPageSize, internalPage * internalPageSize);
  const isEmpty = data.length === 0;

  const handlePageChange = (p: number) => {
    setInternalPage(p);
    onPageChange?.(p);
  };

  const handlePageSizeChange = (size: number) => {
    setInternalPageSize(size);
    setInternalPage(1); // reset page
    onPageSizeChange?.(size);
  };

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
                  <Box style={{ width: "100%", textAlign: "center", padding: "24px 16px", borderRadius: "8px" }}>
                    <Text c="dimmed" fw={500} fz="sm">{emptyText}</Text>
                  </Box>
                </Center>
              </Table.Td>
            </Table.Tr>
          ) : (
            paginatedData.map((row, i) => (
              <Table.Tr key={i}>
                {columns.map((col) => (
                  <Table.Td key={col.accessor}>
                    {col.cell ? col.cell(row) : String(row[col.accessor] ?? "-")}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      <Group gap="apart" mt="md" align="center" justify="space-between">
        {!isEmpty && totalPages > 1 && (
          <Box >
            <Pagination
              total={totalPages}
              value={internalPage}
              onChange={handlePageChange}
              radius="sm"
            />
          </Box>
        )}
        <Box />
        <Group >
          <Text size="sm" color="dimmed">
            รวมทั้งหมด: {total ?? data.length} รายการ
          </Text>
          <Select
            value={internalPageSize.toString()}
            onChange={(val) => handlePageSizeChange(Number(val))}
            data={["5", "10", "20", "50"]}
            style={{ width: 80 }}
          />
        </Group>
      </Group>
    </Box>
  );
}