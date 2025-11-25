export type MockUserType = {
  username: string;
  password: string;
  role: number;
};

export const mockUsers: MockUserType[] = [
  { username: "admin", password: "1234", role: 1 },
  { username: "staff", password: "1234", role: 2 },
  { username: "viewer", password: "1234", role: 3 },
];

export function findMockUser(username: string, password: string) {
  return mockUsers.find(u => u.username === username && u.password === password);
}