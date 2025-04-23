import React from "react";
import Button from "@/components/ui/Button";
import { HomeIcon, LogoutIcon } from "@/components/ui/icons";

const Sidebar = ({ onLogout }) => (
  <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col py-4">
    <nav className="flex-1">
      <ul>
        <li>
          <a
            href="#/dashboard"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            <HomeIcon />
            <span>Dashboard</span>
          </a>
        </li>
      </ul>
    </nav>
    <div className="px-6 mt-auto">
      <Button
        variant="destructive"
        className="w-full flex items-center gap-2 justify-center"
        onClick={onLogout}
      >
        <LogoutIcon /> Abmelden
      </Button>
    </div>
  </aside>
);

export default Sidebar;
