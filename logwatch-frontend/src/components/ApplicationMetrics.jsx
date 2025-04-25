import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import api from "@/api/axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/Button";

const timeRanges = [
  { label: "24h", hours: 24 },
  { label: "7d", hours: 168 },
  { label: "30d", hours: 720 },
];

const ApplicationMetrics = ({ app }) => {
  const [logs, setLogs] = useState([]);
  const [timeRange, setTimeRange] = useState(timeRanges[0]);

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

  // Transform logs into time-series data
  const chartData = logs.reduce((acc, log) => {
    const hour = new Date(log.timestamp).toLocaleString([], {
      hour: "2-digit",
      day: "numeric",
      month: "numeric",
    });
    if (!acc[hour]) acc[hour] = { hour, error: 0, warning: 0, info: 0 };
    acc[hour][log.level]++;
    return acc;
  }, {});

  const chartArray = Object.values(chartData).sort(
    (a, b) => new Date(a.hour) - new Date(b.hour)
  );

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2 mb-4">
        {timeRanges.map((range) => (
          <Button
            key={range.label}
            variant={timeRange.label === range.label ? "default" : "outline"}
            onClick={() => setTimeRange(range)}
          >
            {range.label}
          </Button>
        ))}
      </div>

      {/* Line Chart */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Log Levels Over Time</h2>
          {chartArray.length === 0 ? (
            <p className="text-gray-500">
              No log data available for this range.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartArray}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="error"
                  stroke="#ef4444"
                  name="Errors"
                />
                <Line
                  type="monotone"
                  dataKey="warning"
                  stroke="#facc15"
                  name="Warnings"
                />
                <Line
                  type="monotone"
                  dataKey="info"
                  stroke="#3b82f6"
                  name="Infos"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationMetrics;
