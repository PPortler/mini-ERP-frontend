export type MenuItem = {
    label: string;
    path: string;
    roles: number[];
};

export const menuItems: MenuItem[] = [
    { label: "Dashboard", path: "/dashboard", roles: [1, 2, 3] },
    { label: "Product", path: "/products", roles: [1] },
    { label: "Staff Actions", path: "/dashboard/staff", roles: [1, 2] },
    { label: "View Data", path: "/view", roles: [1, 2, 3] },
];