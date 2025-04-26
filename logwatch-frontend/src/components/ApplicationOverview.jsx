import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ErrorIcon, WarningIcon, InfoIcon } from "@/components/ui/icons";
import { Eye, EyeOff } from "lucide-react";
import api from "@/api/axios";
import { Button } from "@/components/ui/Button";

const ApplicationOverview = ({ app }) => {
  const [stats, setStats] = useState({ errors: 0, warnings: 0, infos: 0 });
  const [recentLogs, setRecentLogs] = useState([]);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const { data } = await api.get("/logs", {
          params: { applicationId: app._id },
        });

        const statsTemp = { errors: 0, warnings: 0, infos: 0 };
        data.forEach((log) => {
          if (log.level === "error") statsTemp.errors++;
          else if (log.level === "warning") statsTemp.warnings++;
          else if (log.level === "info") statsTemp.infos++;
        });

        setStats(statsTemp);
        setRecentLogs(data.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch overview data", err);
      }
    };

    fetchOverviewData();
  }, [app._id]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Stats Summary */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Log Summary (24h)</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-500">
              <ErrorIcon /> <span>{stats.errors} Errors</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-500">
              <WarningIcon /> <span>{stats.warnings} Warnings</span>
            </div>
            <div className="flex items-center gap-2 text-blue-500">
              <InfoIcon /> <span>{stats.infos} Infos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Details */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Application Details</h2>
          <p>
            <span className="font-medium">Name:</span> {app.name}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <Badge variant="outline">{app.status || "Active"}</Badge>
          </p>
          <p>
            <span className="font-medium">Created At:</span>{" "}
            {new Date(app.createdAt).toLocaleDateString()}
          </p>
          <p className="break-all text-sm text-gray-500 flex items-center gap-2">
            <span className="font-medium">API Key:</span>
            {showApiKey ? app.apiKey : "••••••••••••••••••••••"}
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="text-gray-400 hover:text-gray-700"
            >
              {showApiKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </p>
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <Card className="md:col-span-2">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Recent Logs</h2>
          {recentLogs.length === 0 ? (
            <p className="text-gray-500">No logs found.</p>
          ) : (
            <ul className="space-y-2">
              {recentLogs.map((log) => (
                <li key={log._id} className="p-2 border rounded-md">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{log.message}</p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4">
            <Button
              variant="link"
              size="sm"
              onClick={() =>
                (window.location.href = `/applications/${app._id}/logs`)
              }
            >
              View All Logs →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationOverview;
