import { Breadcrumbs, Text } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();

  const paths = location.pathname.split("/").filter(Boolean);

  const cumulativePaths = paths.map((_, idx) => "/" + paths.slice(0, idx + 1).join("/"));

  return (
    <Breadcrumbs>
      {paths.map((path, idx) => {
        const pathName = decodeURIComponent(path); // decode กรณีมีตัวอักษรพิเศษ
        const isLast = idx === paths.length - 1;

        return isLast ? (
          <Text key={idx} fw={500}>
            {pathName}
          </Text>
        ) : (
          <Text
            key={idx}
            fw={500}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(cumulativePaths[idx])}
          >
            {pathName}
          </Text>
        );
      })}
    </Breadcrumbs>
  );
}