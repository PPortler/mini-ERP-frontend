import { Modal, Button, Group, Stack, Title, Box } from "@mantine/core";
import type { FC, ReactNode } from "react";

type ViewModalProps = {
  opened: boolean;
  onClose: () => void;
  title: string;
  content: ReactNode; 
};

const ViewModal: FC<ViewModalProps> = ({
  opened,
  onClose,
  title,
  content,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      size="sm"
      padding="lg"
    >
      <Stack gap="md">
        {/* Title */}
        <Title order={4}>{title}</Title>

        {/* Content */}
        <Box
          component="div"
          style={{
            color: "var(--mantine-color-dimmed)",
            fontSize: "0.875rem",
            whiteSpace: "pre-wrap",
          }}
        >
          {content}
        </Box>

        {/* Close Button */}
        <Group justify="end" mt="md">
          <Button variant="outline" color="gray" onClick={onClose}>
            Close
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ViewModal;