export type MockUserType = {
  username: string;
  password: string;
  name: string;
  role: number;
};

export const mockUsers: MockUserType[] = [
  { username: "admin", password: "1234", role: 1, name: "Harry Kane" },
  { username: "staff", password: "1234", role: 2, name: "Harry Kane" },
  { username: "viewer", password: "1234", role: 3, name: "Harry Kane" },
];

export function findMockUser(username: string, password: string) {
  return mockUsers.find(u => u.username === username && u.password === password);
}