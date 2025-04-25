import React from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";

// Import your page components for each tab:
import ApplicationOverview from "@/components/ApplicationOverview";
import ApplicationLogs from "@/components/ApplicationLogs";
import ApplicationSettings from "@/components/ApplicationSettings";
import ApplicationMetrics from "@/components/ApplicationMetrics";

const ApplicationMainContent = ({ app }) => {
  const { id } = useParams(); // Get application ID from route

  return (
    <div className="mt-4">
      <Routes>
        <Route path="overview" element={<ApplicationOverview app={app} />} />
        <Route path="logs" element={<ApplicationLogs app={app} />} />
        <Route path="settings" element={<ApplicationSettings app={app} />} />
        <Route path="metrics" element={<ApplicationMetrics app={app} />} />

        {/* Redirect base path to overview */}
        <Route
          path="*"
          element={<Navigate to={`/applications/${id}/overview`} replace />}
        />
      </Routes>
    </div>
  );
};

export default ApplicationMainContent;
