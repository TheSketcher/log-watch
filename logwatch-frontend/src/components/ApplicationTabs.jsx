import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  FileTextIcon,
  SettingsIcon,
  BarChart2Icon,
} from "lucide-react";

const tabs = [
  { name: "Overview", path: "overview", icon: HomeIcon },
  { name: "Logs", path: "logs", icon: FileTextIcon },
  { name: "Settings", path: "settings", icon: SettingsIcon },
  { name: "Metrics", path: "metrics", icon: BarChart2Icon },
];

const ApplicationTabs = ({ basePath }) => {
  const location = useLocation();

  return (
    <div className="border-b border-gray-200 mb-4">
      <nav className="-mb-px flex space-x-8">
        {tabs.map(({ name, path, icon: Icon }) => {
          const isActive = location.pathname.includes(`${basePath}/${path}`);
          return (
            <NavLink
              key={name}
              to={`${basePath}/${path}`}
              className={`flex items-center gap-1 pb-2 px-1 border-b-2 font-medium text-sm ${
                isActive
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default ApplicationTabs;
