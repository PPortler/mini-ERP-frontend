import { Group, Text, Button, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../stores/authUserStore";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authActions.logout();
    navigate("/", { replace: true });
  };

  return (
    <Box
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
    
      </Group>

      <Button color="red" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
}