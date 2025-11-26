import { Modal, Button, Group } from "@mantine/core";
import type { FC } from "react";

type ConfirmModalProps = {
    opened: boolean;
    onClose: () => void;
    title: string;
    message: string;
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
        <Modal opened={opened} onClose={onClose} title={title}>
            <p>{message}</p>
            <Group mt="md"
                style={{
                    display: "flex",
                    flexDirection: "row-reverse"
                }}
            >
                <Button color="red" onClick={onConfirm}>
                    ยืนยัน
                </Button>
                <Button variant="outline" onClick={onClose}>
                    ยกเลิก
                </Button>
            </Group>
        </Modal>
    );
};

export default ConfirmModal;