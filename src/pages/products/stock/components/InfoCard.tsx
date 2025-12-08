import { Card, SimpleGrid, Skeleton, Text, Title } from '@mantine/core';

export const InfoCard = ({
  title,
  titleColor,
  bgColor,
  items,
  loading = false,
}: {
  title: string;
  titleColor?: string;
  bgColor?: string;
  items: { label: string; value: string | number | undefined }[];
  loading?: boolean;
}) => (
  <Card shadow="sm" p="md" radius="md" withBorder mb="md" style={{ backgroundColor: bgColor }}>
    <Title order={5} mb="sm" style={{ color: titleColor }}>{title}</Title>
    <SimpleGrid cols={2} spacing={loading ? "sm": ""}>
      {items.map((item, idx) =>
        loading ? (
          <Skeleton key={idx} height={18} width="90%" />
        ) : (
          <Text key={idx}>{item.label}: {item.value ?? '-'}</Text>
        )
      )}
    </SimpleGrid>
  </Card>
);