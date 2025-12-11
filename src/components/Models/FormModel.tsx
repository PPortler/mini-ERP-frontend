import { Modal, Button, Group, TextInput, Select, FileInput } from "@mantine/core";
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
  placeholder?: string;
  helperText?: string;
  accept?: string[]
  onChange?: (value: unknown, values: Record<string, unknown>) => void;
};

type ReusableFormModalProps<T extends Record<string, unknown>> = {
  opened: boolean;
  onClose: () => void;
  title: string;
  fields: Field[];
  initialValues: T;
  onSubmit: (values: T) => void;
  validationSchema?: ObjectSchema<Record<string, unknown>>;
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
    if (!opened) {
      form.reset();
    }
  }, [opened]);

  useEffect(() => {
    const mappedValues: Partial<T> = { ...initialValues };
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
          const handleChange = (val: unknown) => {
            form.setFieldValue(f.name as any, val as any);
            if (f.onChange) f.onChange(val, form.values);
          };

          if (f.type === "file") {
            return (
              <FileInput
                mb="sm"
                key={f.name}

                label={
                  <span>
                    {f.label} {f.required && <span style={{ color: 'red' }}>*</span>}
                  </span>
                }
                accept={f.accept?.map(ext => "." + ext).join(",")}
                disabled={f.disabled}
                error={form.errors[f.name]}
                placeholder={f.placeholder || `Upload ${f.label}`}
                onChange={(file) => {
                  handleChange(file);
                }}
                onBlur={() => form.validateField(f.name)}
              />
            )
          }

          if (f.type === "select") {
            return (
              <Select
                mb="sm"
                key={f.name}
                value={String(form.values[f.name] ?? '')}
                onChange={handleChange}
                onBlur={() => form.validateField(f.name)}
                error={form.errors[f.name]}
                data={f.options || []}
                placeholder={f.placeholder || `Select ${f.label}`}
                disabled={f.disabled}
                label={
                  <span>
                    {f.label} {f.required && <span style={{ color: 'red' }}>*</span>}
                  </span>
                }
                description={f.helperText}
              />
            )
          }

          return (
            <TextInput
              mb="sm"
              key={f.name}
              type={f.type}
              {...form.getInputProps(f.name as keyof T & string)}
              value={String(form.values[f.name] ?? "")}
              disabled={f.disabled}
              placeholder={f.placeholder || `${f.label}`}
              error={form.errors[f.name]}
              label={
                <span>
                  {f.label} {f.required && <span style={{ color: 'red' }}>*</span>}
                </span>
              }
              description={f.helperText}
              onChange={(e) => handleChange(e.currentTarget.value)}
            />
          );
        })}

        <Group mt="xl" style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button type="submit">Confirm</Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default FormModel;