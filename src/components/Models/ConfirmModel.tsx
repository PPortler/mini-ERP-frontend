import { Modal, Button, Group, Stack, Title, Box } from "@mantine/core";
import type { FC } from "react";

type ConfirmModalProps = {
    opened: boolean;
    onClose: () => void;
    title: string;
    message: React.ReactNode;
    onConfirm: () => void;
};

const ConfirmModal: FC<ConfirmModalProps> = ({
    opened,
    onClose,
    title,
    message,
    onConfirm,
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

                {/* Message */}
                <Box component="span" style={{ color: 'var(--mantine-color-dimmed)', fontSize: '0.875rem' }}>
                    {message}
                </Box>
                {/* Action Buttons */}
                <Group justify="end" mt="md">
                    <Button variant="outline" color="gray" onClick={onClose}>
                        ยกเลิก
                    </Button>
                    <Button color="blue" onClick={onConfirm}>
                        ยืนยัน
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default ConfirmModal;