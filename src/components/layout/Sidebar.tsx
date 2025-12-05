import { Text, Stack, Button, Box } from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../layout/layout.module.css"
import { menuItems } from "../../config/menuItems";
import { getRoleCurrent } from "../../utils/RoleUtil";
import { $authUser } from "../../stores/authUserStore";
import { CATEGORY_MENU } from "../../constants/enum/enum";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = $authUser.get()
  const roleCurrent = getRoleCurrent();

  // Group menu by category
  const groupedMenu = Object.values(CATEGORY_MENU).map((category) => ({
    category,
    items: menuItems.filter(
      (item) =>
        item.category === category &&
        roleCurrent &&
        item.roles.includes(roleCurrent)
    ),
  }));

  console.log(groupedMenu)
  return (
    <Stack gap="sm" className={styles.sideBarContainer}>
      {/* User Section */}
      <Box className={styles.userSection}>
        <Text
          style={{
            fontWeight: 700,
            fontSize: "16px"
          }}>
          {authUser?.first_name + ' ' + authUser?.last_name || "Name Test"}
        </Text>
        <Text color="dimmed">
          {roleCurrent}
        </Text>
      </Box>

      <div className={styles.divider}></div>

      {/* Menu Section */}
      <Box className={styles.menuButtonFrame}>
        {groupedMenu.map(({ category, items }) =>
          items.length > 0 ? (
            <Box key={category} mb="sm">
              {/* Category Label */}
              <Text
                fz="12px"
                fw={600}
                tt="uppercase"
                c="dimmed"
                pl={6}
                mb={10}
                style={{ letterSpacing: "0.5px" }}
              >
                {category}
              </Text>

              {/* Items */}
              {items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  location.pathname.startsWith(item.path + "/");

                return (
                  <Button
                    key={item.path}
                    variant="subtle"
                    className={`${styles.menuButton} ${isActive ? styles.activeMenu : ""
                      }`}
                    onClick={() => navigate(item.path)}
                    fullWidth
                  >
                    {item.label}
                  </Button>
                );
              })}

              {/* Divider between categories */}
              <div className={styles.divider}
                style={{
                  marginTop: "10px"
                }}
              />
            </Box>
          ) : null
        )}
      </Box>
    </Stack>
  );
}