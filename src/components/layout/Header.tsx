import { Group, Text, Button, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../stores/authUserStore";
import { loadingActions } from "../../stores/loadingStore";
import { notify } from "../../utils/Notify";
import { AuthService } from "../../services/AuthService";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    loadingActions.show();
    try {
      const res = await AuthService.logout();
      if (!res.ok) {
        notify({ type: "error", message: res.message });
      }

      authActions.clearAuth();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      notify({ type: "error", message: "Logout failed" });
    } finally {
      loadingActions.hide();
    }

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