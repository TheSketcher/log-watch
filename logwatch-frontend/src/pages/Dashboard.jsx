import React, { useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import SearchBar from "@/components/SearchBar";
import ApplicationCard from "@/components/ApplicationCard";
import { PlusIcon } from "@/components/ui/icons";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_APPS.filter((app) => app.name.toLowerCase().includes(q));
  }, [query]);

  const handleCreate = () => navigate("/applications/new");

  return (
    <AppLayout>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <SearchBar value={query} onChange={setQuery} />
        <Button
          onClick={handleCreate}
          className="w-full md:w-auto flex items-center gap-2 justify-center"
        >
          <PlusIcon /> New App
        </Button>
      </div>

      {filteredApps.length === 0 ? (
        <p className="text-gray-500">No Applications found.</p>
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
