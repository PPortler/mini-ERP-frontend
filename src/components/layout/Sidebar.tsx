import { Text, Stack, Button, Box } from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext";
import styles from "../layout/layout.module.css"
import { menuItems } from "../../config/menuItems";
import { getRoleCurrent } from "../../utils/RoleUtil";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = AuthProvider.useAuth();
  const roleCurrent = getRoleCurrent();

  return (
    <Stack gap="sm" className={styles.sideBarContainer}>
      <Box className={styles.userSection}>
        <Text
          style={{
            fontWeight: 700,
            fontSize: "16px"
          }}>
          {user?.first_name + ' ' + user?.last_name || "Name Test"}
        </Text>
        <Text color="dimmed">
          {roleCurrent}
        </Text>
      </Box>
      <div className={styles.divider}></div>
      <Box className={styles.menuButtonFrame}>
        {menuItems
          .filter((item) => roleCurrent && item.roles.includes(roleCurrent))
          .map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");
            return (
              <Button
                key={item.path}
                variant="subtle"
                className={`${styles.menuButton} ${isActive ? styles.activeMenu : ""}`}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            )
          })}
      </Box>
    </Stack>
  );
}