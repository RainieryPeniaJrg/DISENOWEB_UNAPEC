import { createContext, useContext, useState } from "react";
import { AuthResponse } from "../types";
import { authApi } from "../services/api";

type AuthState = {
  user: AuthResponse | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: { name?: string; email?: string; passwordHash?: string }) => Promise<void>;
};

const AuthCtx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(email, password);
      if (!res.accedido) throw new Error(res.message);
      setUser(res);
    } catch (err: any) {
      setError(err?.message ?? "No pudimos iniciar sesión");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.register(name, email, password);
      setUser(res);
    } catch (err: any) {
      setError(err?.message ?? "No pudimos registrar");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  const updateProfile = async (updates: { name?: string; email?: string; passwordHash?: string }) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        id: user.userId,
        name: updates.name ?? user.name,
        email: updates.email ?? user.email,
        passwordHash: updates.passwordHash ?? user.passwordHash ?? "",
        roleId: user.roleId,
        createdAt: user.createdAt,
      } as any;
      await authApi.updateProfile(payload);
      setUser({ ...user, name: payload.name, email: payload.email });
    } catch (err: any) {
      setError(err?.message ?? "No pudimos actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCtx.Provider value={{ user, loading, error, login, register, logout, updateProfile }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
