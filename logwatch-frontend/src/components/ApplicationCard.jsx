import React from "react";
import { ErrorIcon, WarningIcon, InfoIcon } from "@/components/ui/icons";

const ApplicationCard = ({ app }) => {
  const { stats = { errors: 0, warnings: 0, infos: 0 } } = app;

  return (
    <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-1">{app.name}</h3>
      <p className="text-sm text-gray-500 mb-2">
        Created: {new Date(app.createdAt).toLocaleDateString()}
      </p>
      <div className="text-sm space-y-1">
        <p className="flex items-center gap-2 text-red-500">
          <ErrorIcon /> {stats.errors} Errors
        </p>
        <p className="flex items-center gap-2 text-yellow-500">
          <WarningIcon /> {stats.warnings} Warnings
        </p>
        <p className="flex items-center gap-2 text-blue-500">
          <InfoIcon /> {stats.infos} Infos
        </p>
      </div>
    </div>
  );
};

export default ApplicationCard;
