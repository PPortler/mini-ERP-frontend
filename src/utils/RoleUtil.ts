export type RoleId = 1 | 2 | 3;

export const ROLE_NAMES: Record<RoleId, string> = {
  1: "Admin",
  2: "Staff",
  3: "Viewer",
};

export function getRoleName(roleId: number | undefined): string {
  if (!roleId) return "Unknown";
  return ROLE_NAMES[roleId as RoleId] || "Unknown";
}