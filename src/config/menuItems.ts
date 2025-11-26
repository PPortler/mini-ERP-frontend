import { ROLES } from "../constants/enum/enum";

export type MenuItem = {
    label: string;
    path: string;
    roles: string[];
};

export const menuItems: MenuItem[] = [
    { label: "Dashboard", path: "/dashboard", roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.VIEWER] },
    { label: "Product", path: "/products", roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.VIEWER] },
    { label: "Stock", path: "/stock", roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.VIEWER] },
    { label: "Catagories", path: "/catagories", roles: [ROLES.ADMIN, ROLES.STAFF] },
    { label: "AuditLog", path: "/audit-log", roles: [ROLES.ADMIN] },
];