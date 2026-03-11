import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Normalize whatever shape backend returns into a clean user object
const extractUser = (data) => {
  if (!data) return null;
  // Shape 1: { token, user: { ... } }
  if (data.user && data.user._id) return data.user;
  // Shape 2: { token, _id, name, email, role, ... }
  if (data._id) return { _id: data._id, name: data.name, email: data.email, role: data.role, phone: data.phone, avatar: data.avatar };
  // Shape 3: just the user object from /me
  if (data.name && data.email) return data;
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");

  // ── Restore session on mount ──────────────────────────────────────
  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    api.get("/api/auth/me", token)
      .then((data) => setUser(extractUser(data)))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  // ── login ─────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const data = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    const user = extractUser(data);
    setUser(user);
    return user;
  }, []);

  // ── register ──────────────────────────────────────────────────────
  const register = useCallback(async (name, email, password, phone = "") => {
    const data = await api.post("/api/auth/register", { name, email, password, phone });
    localStorage.setItem("token", data.token);
    const user = extractUser(data);
    setUser(user);
    return user;
  }, []);

  // ── Google OAuth ──────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async (googleCredential) => {
    const data = await api.post("/api/auth/google", { credential: googleCredential });
    localStorage.setItem("token", data.token);
    const user = extractUser(data);
    setUser(user);
    return user;
  }, []);

  // ── logout ────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  // ── updateProfile ─────────────────────────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    const data = await api.put("/api/auth/profile", updates, getToken());
    const updated = extractUser(data) || data;
    setUser(updated);
    return updated;
  }, []);

  // ── refreshUser ───────────────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    const data = await api.get("/api/auth/me", getToken());
    setUser(extractUser(data));
  }, []);

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{
      user, loading, isAdmin,
      login, register, loginWithGoogle, logout, updateProfile, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};