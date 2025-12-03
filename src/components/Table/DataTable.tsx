import { Table, Pagination, Box, Text, Center, Select, Group, Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";
import { SORT_BY_TYPE } from "../../constants/enum/enum";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export type Column<T> = {
  header: string;
  accessor: keyof T | string;
  cell?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  setSortField?: (field: string) => void;
  setSortOrder?: (order: string) => void;
  emptyText?: string;
  loading?: boolean;
  sortField?: string;
  sortOrder?: string;
};

export default function DataTable<T>({
  columns,
  data = [],
  page = 1,
  pageSize = 10,
  total,
  onPageChange,
  onPageSizeChange,
  emptyText = "ไม่พบข้อมูล",
  loading = false,
  sortField,
  sortOrder,
  setSortField,
  setSortOrder
}: DataTableProps<T>) {
  const [internalPage, setInternalPage] = useState(page);
  const [internalPageSize, setInternalPageSize] = useState(pageSize);

  useEffect(() => {
    setInternalPage(page)
  },[page])
  useEffect(() => {
    setInternalPageSize(pageSize)
  },[pageSize])

  const totalPages = total ? Math.ceil(total / internalPageSize) : Math.ceil(data.length / internalPageSize) || 1;
  const paginatedData = total ? data : data.slice((internalPage - 1) * internalPageSize, internalPage * internalPageSize);
  const isEmpty = data.length === 0;

  const handlePageChange = (p: number) => {
    setInternalPage(p);
    onPageChange?.(p);
  };

  const handlePageSizeChange = (size: number) => {
    setInternalPageSize(size);
    setInternalPage(1);
    onPageSizeChange?.(size);
  };

  const handleSortChange = (field: string, order: string) => {
    setSortField?.(field);
    setSortOrder?.(order);
  };

  // จำนวน skeleton row ตาม pageSize
  const skeletonRows = Array.from({ length: internalPageSize });

  return (
    <Box>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => {
              const accessor = String(col.accessor);
              const isActive = sortField === accessor;
              const nextOrder = isActive && sortOrder === SORT_BY_TYPE.ASC ? SORT_BY_TYPE.DESC : SORT_BY_TYPE.ASC;

              return (
                <Table.Th
                  key={accessor}
                  style={{ cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSortChange?.(accessor, nextOrder)}
                >
                  <Group gap={6}>
                    <span>{col.header}</span>

                    {isActive && (
                      <>
                        {sortOrder === SORT_BY_TYPE.ASC ? (
                          <ArrowDropUpIcon fontSize="small" />
                        ) : (
                          <ArrowDropDownIcon fontSize="small" />
                        )}
                      </>
                    )}
                  </Group>
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {loading
            ? skeletonRows.map((_, i) => (
              <Table.Tr key={i}>
                {columns.map((col) => (
                  <Table.Td key={String(col.accessor)}>
                    <Skeleton height={26} radius="sm" />
                  </Table.Td>
                ))}
              </Table.Tr>
            ))
            : isEmpty
              ? (
                <Table.Tr>
                  <Table.Td colSpan={columns.length}>
                    <Center py="xl">
                      <Box style={{ width: "100%", textAlign: "center", padding: "24px 16px", borderRadius: "8px" }}>
                        <Text c="dimmed" fw={500} fz="sm">{emptyText}</Text>
                      </Box>
                    </Center>
                  </Table.Td>
                </Table.Tr>
              )
              : paginatedData.map((row, i) => (
                <Table.Tr key={i}>
                  {columns.map((col) => (
                    <Table.Td key={String(col.accessor)}>
                      {col.cell ? col.cell(row) : String(row[col.accessor] ?? "-")}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
          }
        </Table.Tbody>
      </Table>

      <Group gap="apart" mt="md" align="center" justify="space-between">
        {!isEmpty && totalPages > 1 && (
          <Box>
            <Pagination
              total={totalPages}
              value={internalPage}
              onChange={handlePageChange}
              radius="sm"
            />
          </Box>
        )}
        <Box />
        <Group>
          <Text size="sm" color="dimmed">
            รวมทั้งหมด: {total ?? data.length} รายการ
          </Text>
          <Select
            value={internalPageSize.toString()}
            onChange={(val) => handlePageSizeChange(Number(val))}
            data={["5", "10", "20", "50"]}
            style={{ width: 80 }}
            disabled={loading} // ปิด select ตอน loading
          />
        </Group>
      </Group>
    </Box>
  );
}