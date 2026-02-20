export interface User {
  id: string;
  name: string;
  email: string;
  role: "student";
  avatar: string;
  regNumber: string;
}

const TEMP_USERS: { email: string; password: string; user: User }[] = [
  {
    email: "student@skylimit.ac.ke",
    password: "password123",
    user: {
      id: "1",
      name: "Austine Alex",
      email: "student@skylimit.ac.ke",
      role: "student",
      avatar: "AA",
      regNumber: "SKL/2021/001",
    },
  },
];

export const login = (
  email: string,
  password: string
): { success: boolean; user?: User; error?: string } => {
  const match = TEMP_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (match) {
    return { success: true, user: match.user };
  }

  return { success: false, error: "Invalid email or password." };
};