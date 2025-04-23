// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import {
  getStoredUser,
  login as saveToken,
  logout as clearToken,
  isAuthenticated,
} from "@/utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());

  // keep context in sync with storage when the tab reloads
  useEffect(() => {
    if (isAuthenticated() && !user) setUser(getStoredUser() || {});
  }, []);

  const login = (token, userInfo = {}) => {
    saveToken(token, userInfo);
    setUser(userInfo);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
