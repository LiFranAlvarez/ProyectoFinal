import {  useState, useEffect, ReactNode } from "react";
import {  JwtPayload } from "../types/authContextoType";
import { AuthContext } from "../context/authContexto";

const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const isAuthenticated = !!token;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    setToken(storedToken);
    const decoded = decodeJwt(storedToken);
    if (decoded) {
      setUser(decoded);
      sessionStorage.setItem('userId', decoded._id);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    const decoded = decodeJwt(newToken);
    if (decoded) {
      setUser(decoded);
      sessionStorage.setItem('userId', decoded._id);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};