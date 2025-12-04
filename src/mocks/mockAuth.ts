import { ROLES } from "../constants/enum/enum";
import type { UserInfoType } from "../types/user";

export const mockUsers: UserInfoType[] = [
  {
    user_id: "1",
    username: "admin",
    password: "1234",
    role: ROLES.ADMIN,
    first_name: "Harry",
    last_name: "Kane",
    created_at: new Date("2024-01-10T09:15:00Z").toISOString(),
  },
  {
    user_id: "2",
    username: "staff",
    password: "1234",
    role: ROLES.STAFF,
    first_name: "John",
    last_name: "Doe",
    created_at: new Date("2024-02-05T14:30:00Z").toISOString(),
  },
  {
    user_id: "3",
    username: "viewer",
    password: "1234",
    role: ROLES.VIEWER,
    first_name: "Jane",
    last_name: "Smith",
    created_at: new Date("2024-03-01T18:45:00Z").toISOString(),
  },
];

export function findMockUser(username: string, password: string) {
  return mockUsers.find(u => u.username === username && u.password === password);
}