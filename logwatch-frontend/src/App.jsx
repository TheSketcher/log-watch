// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import DashboardPage from "@/pages/Dashboard";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import CreateApplication from "@/pages/CreateApplication";
import ApplicationDashboard from "@/pages/ApplicationDashboard";
import { Toaster } from "sonner";
// ----- Guard -----
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors /> {/* 💡 Renders toasts */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/new"
            element={
              <ProtectedRoute>
                <CreateApplication />
              </ProtectedRoute>
            }
          />
          {/* Application Dashboard Route */}
          <Route
            path="/applications/:id/*"
            element={
              <ProtectedRoute>
                <ApplicationDashboard />
              </ProtectedRoute>
            }
          />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
