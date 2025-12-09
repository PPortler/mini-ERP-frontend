import { Group } from "@mantine/core";
import type { FC, ReactNode } from "react";
import { AppText } from "./AppText";

type InfoRowProps = {
  label: string;
  value: ReactNode;
};

const InfoRow: FC<InfoRowProps> = ({ label, value }) => {
  return (
    <Group gap={1} align="start">
      <AppText fw={850}>{label}: </AppText>
      <div style={{ marginTop: 2 }}>
        {value !== undefined && value !== null ? value : "-"}
      </div>
    </Group>
  );
};

export default InfoRow;