import { menuItems } from "../config/menuItems";

export function getRolesByPath(path: string): string[] {
  const item = menuItems.find(m => m.path === path);
  return item ? item.roles : [];
}