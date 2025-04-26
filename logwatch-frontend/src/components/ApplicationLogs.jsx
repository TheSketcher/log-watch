import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorIcon, WarningIcon, InfoIcon } from "@/components/ui/icons";
import api from "@/api/axios";

const timeRanges = [
  { label: "24h", hours: 24 },
  { label: "7d", hours: 168 },
  { label: "30d", hours: 720 },
];

const ApplicationLogs = ({ app }) => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [timeRange, setTimeRange] = useState(timeRanges[0]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get("/logs", {
          params: { applicationId: app._id, hours: timeRange.hours },
        });
        setLogs(data);
        setFilteredLogs(data); // Initial filter
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };

    fetchLogs();
  }, [app._id, timeRange]);

  // Filter logs by query and level
  useEffect(() => {
    let result = logs;
    if (levelFilter !== "all") {
      result = result.filter((log) => log.level === levelFilter);
    }
    if (query.trim()) {
      result = result.filter(
        (log) =>
          log.message.toLowerCase().includes(query.toLowerCase()) ||
          JSON.stringify(log.meta || {})
            .toLowerCase()
            .includes(query.toLowerCase())
      );
    }
    setFilteredLogs(result);
  }, [query, levelFilter, logs]);

  const getIcon = (level) => {
    switch (level) {
      case "error":
        return <ErrorIcon className="text-red-500" />;
      case "warning":
        return <WarningIcon className="text-yellow-500" />;
      case "info":
        return <InfoIcon className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col md:flex-row md:items-center gap-4">
          <Input
            placeholder="Search logs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="md:w-1/2"
          />
          <div className="flex gap-2">
            {timeRanges.map((range) => (
              <Button
                key={range.label}
                variant={
                  timeRange.label === range.label ? "default" : "outline"
                }
                onClick={() => setTimeRange(range)}
              >
                {range.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant={levelFilter === "all" ? "default" : "outline"}
              onClick={() => setLevelFilter("all")}
            >
              All
            </Button>
            <Button
              variant={levelFilter === "error" ? "default" : "outline"}
              onClick={() => setLevelFilter("error")}
            >
              <ErrorIcon className="w-4 h-4 mr-1" /> Error
            </Button>
            <Button
              variant={levelFilter === "warning" ? "default" : "outline"}
              onClick={() => setLevelFilter("warning")}
            >
              <WarningIcon className="w-4 h-4 mr-1" /> Warning
            </Button>
            <Button
              variant={levelFilter === "info" ? "default" : "outline"}
              onClick={() => setLevelFilter("info")}
            >
              <InfoIcon className="w-4 h-4 mr-1" /> Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Log List */}
      <Card>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <p className="text-gray-500">No logs found for this filter.</p>
          ) : (
            <ul className="space-y-2">
              {filteredLogs.map((log) => (
                <li
                  key={log._id}
                  className="p-3 border rounded-md bg-gray-50 space-y-1 text-sm"
                >
                  <div className="flex justify-between text-xs text-gray-500 items-center">
                    <span className="flex items-center gap-1">
                      {getIcon(log.level)}
                      {log.level.toUpperCase()}
                    </span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p>{log.message}</p>
                  {log.meta && (
                    <pre className="bg-gray-100 p-2 mt-1 rounded text-xs text-gray-600 overflow-x-auto">
                      {JSON.stringify(log.meta, null, 2)}
                    </pre>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationLogs;
