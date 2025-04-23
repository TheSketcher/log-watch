import React, { useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import SearchBar from "@/components/SearchBar";
import ApplicationCard from "@/components/ApplicationCard";

const MOCK_APPS = [
  {
    id: "661f31e5d1ba115e5b53f201",
    name: "Auth-Service",
    createdAt: "2025-04-20T10:12:00Z",
    apiKey: "A1B2C3D4E5F6",
    stats: { errors: 7, warnings: 14, infos: 233 },
  },
  {
    id: "661f31e5d1ba115e5b53f202",
    name: "Payment-Gateway",
    createdAt: "2025-04-18T08:45:00Z",
    apiKey: "G7H8I9J0K1L2",
    stats: { errors: 1, warnings: 4, infos: 102 },
  },
];

const DashboardPage = () => {
  const [query, setQuery] = useState("");

  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_APPS.filter((app) => app.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <AppLayout>
      <SearchBar value={query} onChange={setQuery} />
      {filteredApps.length === 0 ? (
        <p className="text-gray-500">Keine Applikationen gefunden.</p>
      ) : (
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
          {filteredApps.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default DashboardPage;
