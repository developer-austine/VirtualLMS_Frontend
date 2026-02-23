export type UserRole = "student" | "lecturer" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  regNumber?: string;   
  staffId?: string;     
  department?: string;
}

interface TempUser {
  email: string;
  password: string;
  user: AuthUser;
}

const TEMP_USERS: TempUser[] = [
  {
    email: "student@skylimit.ac.ke",
    password: "password123",
    user: {
      id: "s1",
      name: "Austine Alex",
      email: "student@skylimit.ac.ke",
      role: "student",
      avatar: "AA",
      regNumber: "SKL/2021/001",
    },
  },
  {
    email: "lecturer@skylimit.ac.ke",
    password: "lecturer123",
    user: {
      id: "l1",
      name: "Jared Maranga",
      email: "lecturer@skylimit.ac.ke",
      role: "lecturer",
      avatar: "JM",
      staffId: "STAFF/2018/042",
      department: "School of Technology",
    },
  },
  {
    email: "admin@skylimit.ac.ke",
    password: "admin123",
    user: {
      id: "a1",
      name: "Admin User",
      email: "admin@skylimit.ac.ke",
      role: "admin",
      avatar: "AD",
      staffId: "ADMIN/2015/001",
    },
  },
];

// ── Login ─────────────────────────────────────────
export const login = async (
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  const match = TEMP_USERS.find(
    (u) => u.email === email && u.password === password
  );
  if (match) return { success: true, user: match.user };
  return { success: false, error: "Invalid email or password." };
};

// ── Session helpers ────────────────────────────────
export const saveSession = (user: AuthUser) =>
  sessionStorage.setItem("skylimit_user", JSON.stringify(user));

export const loadSession = (): AuthUser | null => {
  const raw = sessionStorage.getItem("skylimit_user");
  return raw ? (JSON.parse(raw) as AuthUser) : null;
};

export const clearSession = () => sessionStorage.removeItem("skylimit_user");

/*
 * const res = await fetch('/api/auth/login', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email, password }),
 * });
 * const data = await res.json();
 * if (res.ok) return { success: true, user: data.user };
 * return { success: false, error: data.message };
 */