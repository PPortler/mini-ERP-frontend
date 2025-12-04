import { Card, Text, Title, Skeleton } from "@mantine/core";

interface SummaryCardProps {
  label: string;
  value: string | number;
  loading?: boolean;
}

export function SummaryCard({ label, value, loading = false }: SummaryCardProps) {
  return (
    <Card shadow="sm" padding="lg">
      {loading ? (
        <>
          <Skeleton height={14} width="40%" mb="sm" />
          <Skeleton height={32} width="60%" />
        </>
      ) : (
        <>
          <Text size="sm" c="dimmed">
            {label}
          </Text>
          <Title order={2}>{value}</Title>
        </>
      )}
    </Card>
  );
}