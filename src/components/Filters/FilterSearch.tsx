import { Group, TextInput, Select } from "@mantine/core";

type OptionType = { label: string; value: string | number };

interface FilterField {
  key: string;
  label: string;
  type: "text" | "select";
  value?: string | number;
  options?: OptionType[];
  onChange: (value: string) => void;
}

interface TableFilterInputProps {
  fields: FilterField[];
}

export default function FilterInputs({ fields }: TableFilterInputProps) {
  return (
    <Group gap="sm" align="flex-end" mb="md" wrap="wrap">
      {fields.map((f) => {
        if (f.type === "text") {
          return (
            <TextInput
              key={f.key}
              label={f.label}
              value={f.value ?? ""}
              onChange={(e) => f.onChange(e.target.value)}
            />
          );
        } else if (f.type === "select") {
          const optionsWithAll: OptionType[] = [
            { label: "ทั้งหมด", value: "" },
            ...(f.options || []),
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