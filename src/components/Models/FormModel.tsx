import { Modal, Button, Group, TextInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

type Field = {
  name: string;
  label: string;
  type: string;
  options?: { label: string; value: string }[];
  disabled?: boolean;
  required?: boolean;
};

type ReusableFormModalProps<T extends Record<string, any>> = {
  opened: boolean;
  onClose: () => void;
  title: string;
  fields: Field[];
  initialValues: T;
  onSubmit: (values: T) => void;
  validationSchema?: any; // เพิ่ม schema ของ yup
};

const FormModel = <T extends Record<string, any>>({
  opened,
  onClose,
  title,
  fields,
  initialValues,
  onSubmit,
  validationSchema,
}: ReusableFormModalProps<T>) => {
  const form = useForm<T>({
    initialValues,
    validate: validationSchema
      ? (values) => {
        try {
          validationSchema.validateSync(values, { abortEarly: false });
          return {};
        } catch (err: any) {
          const errors: Record<string, string> = {};
          if (err.inner) {
            err.inner.forEach((e: any) => {
              if (e.path) errors[e.path] = e.message;
            });
          }
          return errors;
        }
      }
      : undefined,
  });

  useEffect(() => {
    const mappedValues = { ...initialValues } as Record<string, any>;
    fields.forEach(f => {
      if (f.type === "number" && mappedValues[f.name] === 0) {
        mappedValues[f.name] = undefined;
      }
    });
    form.setValues(mappedValues as T);
  }, [initialValues]);

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <form
        onSubmit={form.onSubmit((values) => {
          onSubmit(values);
        })}
      >
        {fields.map((f) => {

          return f.type === "select" ? (
            <Select
              mb="sm"
              key={f.name}
              value={form.values[f.name]}
              onChange={(val) =>
                form.setFieldValue(f.name as keyof T, (val ?? '') as T[keyof T])
              }
              onBlur={() => form.validateField(f.name)}
              error={form.errors[f.name]}
              data={f.options || []}
              label={
                <span>
                  {f.label}{" "}
                  {f.required && <span style={{ color: 'red' }}>*</span>}
                </span>
              }
            />
          ) : (
            <TextInput
              mb="sm"
              key={f.name}
              type={f.type}
              {...form.getInputProps(f.name as keyof T & string)}
              disabled={f.disabled}
              error={form.errors[f.name]}
              label={
                <span>
                  {f.label}{" "}
                  {f.required && <span style={{ color: 'red' }}>*</span>}
                </span>
              }
            />
          );
        })}

        <Group mt="xl" style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button type="submit">บันทึก</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default FormModel;