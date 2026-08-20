import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return;
      }
      const { data } = await api.get("/auth/me");
      setUser(data.data.user);
    } catch {
      localStorage.removeItem("accessToken");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchUser();
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [fetchUser]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", data.data.accessToken);
    setUser(data.data.user);
    return data.data.user;
  };

  const signup = async (formData) => {
    const { data } = await api.post("/auth/signup", formData);
    localStorage.setItem("accessToken", data.data.accessToken);
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore — clear locally anyway
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
