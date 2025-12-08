import { Badge } from "@mantine/core";
import { STATUS_PO } from "../../constants/enum/enum";

const statusColor: Record<string, string> = {
    [STATUS_PO.DRAFT]: "gray",
    [STATUS_PO.CONFIRMED]: "blue",
    [STATUS_PO.RECEIVED]: "green",
    [STATUS_PO.CANCELLED]: "red",
};

const StatusBadge = ({ status }: { status: string }) => {
    return (
        <Badge
            color={statusColor[status] || "gray"}
            variant="light"
            size="sm"
            radius="sm"
            style={{ fontWeight: 600 }}
        >
            {status}
        </Badge>
    );
};

export default StatusBadge;