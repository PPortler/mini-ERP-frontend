import { Button as MantineButton, Skeleton, type ButtonProps } from "@mantine/core";
import type { ReactNode, MouseEvent } from "react";

interface AppButtonProps extends ButtonProps {
  loading?: boolean; // ถ้ามี skeleton หรือ loading state
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function AppButton({ children, loading, ...props }: AppButtonProps) {
  if (loading) {
    return (
      <Skeleton
        height={36}
        width={120}
        radius="sm"
        animate
      />
    );
  }

  return (
    <MantineButton
      {...props}
      loading={loading}
      radius="sm"
    >
      {children}
    </MantineButton>
  );
}