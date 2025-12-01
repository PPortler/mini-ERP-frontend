import { ROLES } from "../constants/enum/enum";
import type { UserResponse } from "../services/AuthService";

export const mockUsers: UserResponse[] = [
  {
    id: "1",
    username: "admin",
    password: "1234",
    role: ROLES.ADMIN, 
    first_name: "Harry",
    last_name: "Kane",
  },
  {
    id: "2",
    username: "staff",
    password: "1234",
    role: ROLES.STAFF, // Staff
    first_name: "John",
    last_name: "Doe",
  },
  {
    id: "3",
    username: "viewer",
    password: "1234",
    role: ROLES.VIEWER, // Viewer
    first_name: "Jane",
    last_name: "Smith",
  },
];

export function findMockUser(username: string, password: string) {
  return mockUsers.find(u => u.username === username && u.password === password);
}