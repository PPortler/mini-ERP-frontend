import { Text, Skeleton } from "@mantine/core";
import type { TextProps } from "@mantine/core";
import type { ReactNode } from "react";

interface AppTextProps extends TextProps {
  loading?: boolean;
  skeletonWidth?: number | string;
  skeletonHeight?: number | string;
  children?: ReactNode;
}

export function AppText({
  children,
  loading = false,
  skeletonWidth = 120,
  skeletonHeight = 16,
  ...rest
}: AppTextProps) {
  if (loading) {
    return (
      <Skeleton
        width={skeletonWidth}
        height={skeletonHeight}
        radius="sm"
      />
    );
  }

  return <Text {...rest}>{children}</Text>;
}