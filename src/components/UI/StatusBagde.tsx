import { Badge, type BadgeProps,  } from "@mantine/core";

type StatusBadgeProps = {
  status: string;
  statusColor: Record<string, string>; // ให้ส่ง mapping จากข้างนอก
} & BadgeProps;

const StatusBadge = ({
  status,
  statusColor,
  size = "sm",
  variant = "light",
  radius = "sm",
  ...rest
}: StatusBadgeProps) => {
  return (
    <Badge
      color={statusColor[status] || "gray"}
      variant={variant}
      size={size}
      radius={radius}
      style={{ fontWeight: 600 }}
      {...rest}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;

