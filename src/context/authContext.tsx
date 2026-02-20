import { createContext, useContext, useState, type ReactNode } from "react";
import { login as authLogin, type User } from "../lib/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem("kcau_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, password: string) => {
    const result = authLogin(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      sessionStorage.setItem("kcau_user", JSON.stringify(result.user));
    }
    return { success: result.success, error: result.error };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("kcau_user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};