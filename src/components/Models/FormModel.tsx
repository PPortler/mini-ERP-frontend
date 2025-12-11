import { Modal, Button, Group, TextInput, Select, FileInput, Paper, Box, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { ValidationError, type ObjectSchema } from "yup";
import type { FileType } from "../../types/file";

type Field = {
  name: string;
  label: string;
  type: string;
  options?: { label: string; value: string }[];
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  accept?: string[];
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
  const [uploadedFiles, setUploadedFiles] = useState<FileType[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);

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

  const handleDelete = (fieldName: string) => {
    setUploadedFiles([]);
    form.setFieldValue(fieldName as any, null);
    setFileInputKey(prev => prev + 1);
  };

  useEffect(() => {
    const mappedValues: Partial<T> = { ...initialValues };
    fields.forEach(f => {
      const key = f.name as keyof T;
      if (f.type === "number" && mappedValues[key] === 0) {
        mappedValues[key] = undefined;
      }
      if (f.type === "file") {
        const value = initialValues[f.name] as FileType;
        if (!value) return;
        let normalizedArray: FileType[] = [];

        // case: backend sent array
        if (Array.isArray(value)) {
          normalizedArray = value;
        }
        // case: backend sent object
        else if (typeof value === "object") {
          normalizedArray = [value];
        }

        // map ให้เป็นรูปแบบที่ UI ใช้
        const mapped = normalizedArray.map(file => ({
          fileName: file.fileName,
          extension: file.extension,
          fileUrl: file.fileUrl,
          fileSize: file.fileSize || 0,
        }));

        setUploadedFiles(mapped);
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
              <>
                <FileInput
                  mb="sm"
                  key={f.name + fileInputKey}
                  label={
                    <span>
                      {f.label} {f.required && <span style={{ color: "red" }}>*</span>}
                    </span>
                  }
                  accept={f.accept?.map(ext => "." + ext).join(",")}
                  disabled={f.disabled}
                  error={form.errors[f.name]}
                  placeholder={f.placeholder || `Upload ${f.label}`}
                  onChange={(file) => {
                    if (!file) return;
                    if (!(file instanceof File)) {
                      form.setFieldError(f.name, "Invalid file");
                      return;
                    }
                    form.setFieldValue(f.name as any, file);
                    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
                    const preview = {
                      fileName: file.name,
                      extension: ext,
                      fileSize: file.size,
                      fileUrl: URL.createObjectURL(file),
                    };

                    setUploadedFiles([preview]);
                  }}
                />

                {uploadedFiles.length > 0 && (
                  <Box mt="sm">
                    {uploadedFiles.map((file, idx) => (
                      <Paper
                        key={idx}
                        withBorder
                        radius="md"
                        p="sm"
                        mt="xs"
                      >
                        <Group justify="space-between" gap="apart" align="center">
                          <Box>
                            <Text size="sm" fw={500} lineClamp={1}
                              style={{
                                maxWidth: 300,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {file.fileName}
                            </Text>
                            <Text size="xs" c="dimmed"
                              style={{
                                maxWidth: 100,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {file.extension?.toUpperCase()} • {(file.fileSize / 1024).toFixed(1)} KB
                            </Text>
                          </Box>

                          <Button
                            color="red"
                            variant="light"
                            size="xs"
                            onClick={() => handleDelete(f.name)}
                          >
                            ลบ
                          </Button>
                        </Group>
                      </Paper>
                    ))}
                  </Box>
                )}
              </>
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