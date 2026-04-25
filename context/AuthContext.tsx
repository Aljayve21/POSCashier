import api from "@/src/axios";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "cashier";
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  signIn: (payload: LoginPayload) => Promise<AuthUser>;
  updateUser: (user: Partial<AuthUser>) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const signIn = async ({ email, password }: LoginPayload) => {
    const response = await api.post("/auth/login", {
      email,
      password,
      role: "cashier",
    });

    const nextUser = response.data.user as AuthUser;
    setUser(nextUser);
    return nextUser;
  };

  const signOut = () => {
    setUser(null);
  };

  const updateUser = (nextUser: Partial<AuthUser>) => {
    setUser((current) => (current ? { ...current, ...nextUser } : current));
  };

  return (
    <AuthContext.Provider value={{ user, signIn, updateUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
