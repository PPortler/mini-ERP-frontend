import { useMemo } from "react";
import { getRoleName } from "../utils/RoleUtil"

export function useRoleName(roleId?: number) {
  return useMemo(() => getRoleName(roleId), [roleId]);
}