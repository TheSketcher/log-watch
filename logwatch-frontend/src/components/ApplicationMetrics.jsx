import React, { useEffect, useState, useMemo } from "react";
import api from "@/api/axios";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Line,
  LineChart,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/Button";

const timeRanges = [
  { label: "24h", hours: 24, groupBy: "hour" },
  { label: "7d", hours: 168, groupBy: "day" },
  { label: "30d", hours: 720, groupBy: "day" },
];

const ApplicationMetrics = ({ app }) => {
  const [logs, setLogs] = useState([]);
  const [timeRange, setTimeRange] = useState(timeRanges[0]);
  const [visibleLevels, setVisibleLevels] = useState({
    error: true,
    warning: true,
    info: true,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await api.get("/logs", {
          params: { applicationId: app._id, hours: timeRange.hours },
        });
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch logs for metrics", err);
      }
    };

    fetchMetrics();
  }, [app._id, timeRange]);

  // Generate the full time range with empty points
  const generateFullTimeRange = useMemo(() => {
    const now = new Date();
    const result = {};
    const total = timeRange.hours;

    for (let i = total - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 3600 * 1000);
      let key, label;

      if (timeRange.groupBy === "hour") {
        date.setMinutes(0, 0, 0);
        key = date.toISOString();
        label = date.getHours().toString().padStart(2, "0") + ":00";
      } else {
        date.setHours(0, 0, 0, 0);
        key = date.toISOString();
        label = date.toLocaleDateString();
      }

      result[key] = {
        time: label,
        rawTime: date,
        error: 0,
        warning: 0,
        info: 0,
      };
    }

    return result;
  }, [timeRange]);

  const chartData = useMemo(() => {
    const now = new Date();
    const total = timeRange.hours;
    const grouped = {};

    // Initialize all time slots
    for (let i = total - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 3600 * 1000);
      let key, label;

      if (timeRange.groupBy === "hour") {
        const hourKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
        key = hourKey;
        label = date.getHours().toString().padStart(2, "0") + ":00";
      } else {
        const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        key = dayKey;
        label = date.toLocaleDateString();
      }

      grouped[key] = {
        key,
        time: label,
        error: 0,
        warning: 0,
        info: 0,
      };
    }

    // Aggregate logs
    logs.forEach((log) => {
      const date = new Date(log.timestamp);
      let key;

      if (timeRange.groupBy === "hour") {
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
      } else {
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      }

      if (grouped[key]) {
        grouped[key][log.level]++;
      }
    });

    return Object.values(grouped);
  }, [logs, timeRange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Levels Over Time</CardTitle>
        <CardDescription>
          Log activity for the last {timeRange.label}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4">
        {/* Filters */}
        <div className="flex justify-between mb-4 flex-wrap gap-2">
          {/* Time Range */}
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

          {/* Log Level Toggles */}
          <div className="flex gap-2">
            {["error", "warning", "info"].map((level) => (
              <Button
                key={level}
                onClick={() =>
                  setVisibleLevels((prev) => ({
                    ...prev,
                    [level]: !prev[level],
                  }))
                }
                className={`${
                  level === "error"
                    ? "bg-[#ef4444]"
                    : level === "warning"
                    ? "bg-[#facc15] text-black"
                    : "bg-[#3b82f6]"
                } ${
                  visibleLevels[level] ? "opacity-100" : "opacity-20"
                } hover:opacity-100 text-white`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Line Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // ⬇️ Dynamically set tick intervals:
              interval={
                timeRange.label === "24h" ? 1 : timeRange.label === "7d" ? 0 : 2
              }
            />

            <YAxis allowDecimals={false} domain={[0, "dataMax"]} />
            <Tooltip />
            <Legend />
            {visibleLevels.error && (
              <Line type="monotone" dataKey="error" stroke="#ef4444" />
            )}
            {visibleLevels.warning && (
              <Line type="monotone" dataKey="warning" stroke="#facc15" />
            )}
            {visibleLevels.info && (
              <Line type="monotone" dataKey="info" stroke="#3b82f6" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>

      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ApplicationMetrics;
