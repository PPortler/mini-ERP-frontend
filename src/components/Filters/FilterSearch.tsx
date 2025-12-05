import { Group, TextInput, Select, Skeleton, Stack } from "@mantine/core";

type OptionType = { label: string; value: string | number };

interface FilterField {
  key: string;
  label: string;
  type: "text" | "select";
  value?: string | number;
  options?: OptionType[];
  placeholder?: string;
  onChange: (value: string) => void;
}

interface TableFilterInputProps {
  fields: FilterField[];
  loading?: boolean;
}

export default function FilterInputs({ fields, loading = false }: TableFilterInputProps) {
  return (
    <Group gap="sm" align="flex-end" mb="md" wrap="wrap">
      {fields.map((f) => {
        if (loading) {
          // แสดง Skeleton แทน input
          return (
            <Stack gap="xs" key={f.key}>
              <Skeleton
                key={f.key + "-label"}
                height={16}
                width={50}
                radius="sm"
                animate
              />
              <Skeleton
                key={f.key + "-input"}
                height={30}
                width={200}
                radius="sm"
                animate
              />
            </Stack>
          );
        }

        if (f.type === "text") {
          return (
            <TextInput
              key={f.key}
              label={f.label}
              placeholder={f.placeholder || `${f.label}`}
              value={f.value ?? ""}
              onChange={(e) => f.onChange(e.target.value)}
            />
          );
        } else if (f.type === "select") {
          const optionsWithAll = [
            { label: "All", value: "" },
            ...(f.options || []).map(opt => ({
              label: opt.label,
              value: String(opt.value),
            })),
          ];
          return (
            <Select
              key={f.key}
              label={f.label}
              value={f.value as string | undefined}
              onChange={(val) => f.onChange(val ?? "")}
              data={optionsWithAll}
              placeholder="เลือก..."
            />
          );
        }
        return null;
      })}
    </Group>
  );
}