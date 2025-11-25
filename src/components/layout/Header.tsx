import { Group, Text, Button } from "@mantine/core";
import { AuthProvider } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { logout, role } = AuthProvider.useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
      }}
    >
      <Group>
        <Text fw={700}>ERP System</Text>
        {role && (
          <Text color="dimmed">
            Role: {role === 1 ? "Admin" : role === 2 ? "Staff" : "Viewer"}
          </Text>
        )}
      </Group>

      <Button color="red" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}