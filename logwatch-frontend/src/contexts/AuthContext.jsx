// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import {
  isAuthenticated,
  login as saveToken,
  logout as removeToken,
} from "@/utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // beim Start prüfen
  useEffect(() => {
    if (isAuthenticated()) setUser({}); // evtl. Profil vom Server holen
  }, []);

  const login = (token, userInfo = {}) => {
    saveToken(token);
    setUser(userInfo);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
