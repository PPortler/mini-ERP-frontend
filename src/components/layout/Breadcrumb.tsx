import { Breadcrumbs, Text } from "@mantine/core";
import { useLocation } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <Breadcrumbs>
      {paths.map((path, idx) => (
        <Text key={idx} fw={500}>
          {path}
        </Text>
      ))}
    </Breadcrumbs>
  );
}