import Cookies from "js-cookie";

export function getRoleCurrent(): string | null {
  try {
    const userCookie = Cookies.get("user");
    if (!userCookie) return null;

    const user = JSON.parse(userCookie);
    return user.role || null;
  } catch (err) {
    console.error("Failed to get current role:", err);
    return null;
  }
}