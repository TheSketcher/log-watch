import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "@/pages/Login";
import DashboardPage from "@/pages/Dashboard";
import { isAuthenticated } from "@/utils/auth";

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [user, setUser] = useState(null);

  // keep user in state when reloading (optional)
  useEffect(() => {
    if (isAuthenticated() && !user) setUser({});
  }, []);

  const handleLogin = (credentials) => {
    setUser(credentials);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated() ? "/dashboard" : "/login"}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
