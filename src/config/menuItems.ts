import { CATEGORY_MENU, ROLES } from "../constants/enum/enum";

export type MenuItem = {
    label: string;
    path: string;
    roles: string[];
    category: string;
};

export const menuItems: MenuItem[] = [
    //Overview
    { label: "Dashboard", path: "/dashboard", roles: [ROLES.ADMIN], category: CATEGORY_MENU.OVERVIEW },
    //Inventory
    { label: "Products", path: "/products", roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.VIEWER], category: CATEGORY_MENU.INVENTORY },
    { label: "Catagories", path: "/catagories", roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.VIEWER], category: CATEGORY_MENU.INVENTORY },
    { label: "Stock Transaction", path: "/stock-transaction", roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.VIEWER], category: CATEGORY_MENU.INVENTORY },
    //Purchase
    { label: "Suppliers", path: "/suppliers", roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.VIEWER], category: CATEGORY_MENU.PURCHASE },
    { label: "Purchase Order", path: "/po", roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.VIEWER], category: CATEGORY_MENU.PURCHASE },
    //Admin
    { label: "User Management", path: "/users-management", roles: [ROLES.ADMIN], category: CATEGORY_MENU.ADMIN },
    { label: "AuditLog", path: "/audit-log", roles: [ROLES.ADMIN], category: CATEGORY_MENU.ADMIN },
    { label: "Report", path: "/reports", roles: [ROLES.ADMIN], category: CATEGORY_MENU.ADMIN },
];