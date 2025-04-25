import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { HomeIcon, LogoutIcon } from "@/components/ui/icons";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col py-4">
      <nav className="flex-1">
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive ? "bg-gray-800" : "hover:bg-gray-800"
                }`
              }
            >
              <HomeIcon />
              <span>Dashboard</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="px-6 mt-auto">
        <Button
          variant="destructive"
          className="w-full flex items-center gap-2 justify-center"
          onClick={handleLogout}
        >
          <LogoutIcon /> Abmelden
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
