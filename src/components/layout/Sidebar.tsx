import { Text, Stack, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { role } = AuthProvider.useAuth();

  return (
    <Stack gap="sm">
      <Text fw={700}>Menu</Text>

      {role === 1 && (
        <Button variant="subtle" onClick={() => navigate("/dashboard/admin")}>
          Admin Panel
        </Button>
      )}

      {(role === 1 || role === 2) && (
        <Button variant="subtle" onClick={() => navigate("/dashboard/staff")}>
          Staff Actions
        </Button>
      )}

      <Button variant="subtle" onClick={() => navigate("/dashboard/view")}>
        View Data
      </Button>
    </Stack>
  );
}