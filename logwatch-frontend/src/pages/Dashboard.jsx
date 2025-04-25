import React, { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import SearchBar from "@/components/SearchBar";
import ApplicationCard from "@/components/ApplicationCard";
import { PlusIcon } from "@/components/ui/icons";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

const Dashboard = () => {
  const [apps, setApps] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch apps and stats
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await api.get("/applications");

        // Fetch logs per app and compute stats
        const appsWithStats = await Promise.all(
          data.map(async (app) => {
            try {
              const logsRes = await api.get("/logs", {
                params: { applicationId: app._id },
              });
              console.log("Logs for", app.name, logsRes.data);
              const stats = { errors: 0, warnings: 0, infos: 0 };
              logsRes.data.forEach((log) => {
                if (log.level === "error") stats.errors++;
                else if (log.level === "warning") stats.warnings++;
                else if (log.level === "info") stats.infos++;
              });

              return { ...app, stats };
            } catch (err) {
              console.error(`Failed to fetch logs for ${app.name}`, err);
              return { ...app, stats: { errors: 0, warnings: 0, infos: 0 } };
            }
          })
        );

        setApps(appsWithStats);
      } catch (err) {
        console.error("Failed to load applications", err);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((app) => app.name.toLowerCase().includes(q));
  }, [apps, query]);

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

      {loading ? (
        <p className="text-gray-500">Loading applications…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredApps.length === 0 ? (
        <p className="text-gray-500">No Applications found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
          {filteredApps.map((app) => (
            <ApplicationCard key={app._id} app={app} />
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Dashboard;
