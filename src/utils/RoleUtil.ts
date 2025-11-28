import { $authUser } from "../stores/authUserStore";

export function getRoleCurrent(): string | null {
 
  try {
     const authUser = $authUser.get()
    if (!authUser) return null;

    return authUser.role || null;
  } catch (err) {
    console.error("Failed to get current role:", err);
    return null;
  }
}