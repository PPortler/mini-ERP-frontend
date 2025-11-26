import { Table, Pagination, Box } from "@mantine/core";
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
};

export default function DataTable({
  columns,
  data,
  pageSize = 5,
}: DataTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = data.slice(start, end);

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
          {paginatedData.map((row, i) => (
            <Table.Tr key={i}>
              {columns.map((col) => (
                <Table.Td key={col.accessor}>
                  {col.cell ? col.cell(row) : row[col.accessor]}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* Pagination */}
      <Pagination
        total={totalPages}
        value={page}
        onChange={setPage}
        mt="md"
        radius="sm"
      />
    </Box>
  );
}