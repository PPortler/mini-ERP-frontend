import { ROLES } from "../constants/enum/enum";
import type { UserInfoType } from "../types/user";

export type MockUserType = {
  username: string;
  password: string;
  name: string;
  role: number;
};

export const mockUsers: UserInfoType[] = [
  {
    user_id: "1",
    username: "admin",
    password: "1234",
    role: ROLES.ADMIN, 
    first_name: "Harry",
    last_name: "Kane",
    phone: "0812345678",
  },
  {
    user_id: "2",
    username: "staff",
    password: "1234",
    role: ROLES.STAFF, // Staff
    first_name: "John",
    last_name: "Doe",
    phone: "0898765432",
  },
  {
    user_id: "3",
    username: "viewer",
    password: "1234",
    role: ROLES.VIEWER, // Viewer
    first_name: "Jane",
    last_name: "Smith",
    phone: "0823456789",
  },
];

export function findMockUser(username: string, password: string) {
  return mockUsers.find(u => u.username === username && u.password === password);
}