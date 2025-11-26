import { Modal, Button, Group, TextInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

type Field = {
  name: string;
  label: string;
  type: string
  options?: { label: string; value: string }[];
};

type ReusableFormModalProps<T extends Record<string, any>> = {
  opened: boolean;
  onClose: () => void;
  title: string;
  fields: Field[];
  initialValues: T;
  onSubmit: (values: T) => void;
};

const FormModel = <T extends Record<string, any>>({
  opened,
  onClose,
  title,
  fields,
  initialValues,
  onSubmit,
}: ReusableFormModalProps<T>) => {
  const form = useForm<T>({ initialValues });

  useEffect(() => {
    form.setValues(initialValues);
  }, [initialValues]);

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <form
        onSubmit={form.onSubmit((values) => {
          onSubmit(values);
        })}
      >
        {fields.map((f) => {
          if (f.type === "select") {
            return (
              <Select
                key={f.name}
                label={f.label}
                data={f.options || []}
                value={form.values[f.name]}
                onChange={(val) => form.setFieldValue(f.name, val)}
                error={form.errors[f.name]}
                onBlur={() => form.validateField(f.name)}
              />
            );
          }

          return (
            <TextInput
              key={f.name}
              type={f.type}
              label={f.label}
              {...form.getInputProps(f.name as keyof T)}
            />
          );
        })}

        <Group mt="md"
          style={{
            display: "flex",
            flexDirection: "row-reverse"
          }}
        >
          <Button type="submit">บันทึก</Button>
          <Button variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default FormModel;