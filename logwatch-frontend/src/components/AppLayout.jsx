import React from "react";
import Sidebar from "@/components/Sidebar";

const AppLayout = ({ children }) => {
  const handleLogout = () => {
    // TODO: auth sign-out
    console.log("logout…");
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
};

export default AppLayout;
