import { Modal, Button, Group, TextInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { ValidationError, type ObjectSchema } from "yup";

type Field = {
  name: string;
  label: string;
  type: string;
  options?: { label: string; value: string }[];
  disabled?: boolean;
  required?: boolean;
};

type ReusableFormModalProps<T extends Record<string, unknown>> = {
  opened: boolean;
  onClose: () => void;
  title: string;
  fields: Field[];
  initialValues: T;
  onSubmit: (values: T) => void;
  validationSchema?: ObjectSchema<Partial<T>>; // <-- เปลี่ยนเป็น Partial<T>

};

const FormModel = <T extends Record<string, unknown>>({
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
        } catch (err) {
          // เช็กว่า err เป็น Yup ValidationError หรือไม่
          if (err instanceof ValidationError) {
            const errors: Record<string, string> = {};
            err.inner.forEach((e) => {
              if (e.path) errors[e.path] = e.message;
            });
            return errors;
          }
          // fallback สำหรับ error อื่น ๆ
          return {};
        }
      }
      : undefined,
  });

  useEffect(() => {
    const mappedValues: Partial<T> = { ...initialValues }; // ใช้ Partial<T> แทน any
    fields.forEach(f => {
      const key = f.name as keyof T;
      if (f.type === "number" && mappedValues[key] === 0) {
        mappedValues[key] = undefined;
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
              value={String(form.values[f.name] ?? '')}
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