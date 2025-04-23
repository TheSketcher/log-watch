import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { ErrorIcon, WarningIcon, InfoIcon } from "@/components/ui/icons";

const ApplicationCard = ({ app }) => (
  <Card className="transition-transform hover:scale-[1.02] hover:shadow-lg">
    <CardContent>
      {/* App name */}
      <h3 className="text-xl font-semibold mb-4">{app.name}</h3>
      <h5 className="text-m text-gray-400">Last 24 hours</h5>
      {/* 24h log statistics */}
      <ul className="space-y-1 text-sm text-gray-700">
        <li className="flex items-center gap-2">
          {/* red icon */}
          <ErrorIcon className="text-red-600" />
          <span>
            <span className="font-medium">{app.stats.errors}</span> Errors
          </span>
        </li>
        <li className="flex items-center gap-2">
          {/* yellow icon */}
          <WarningIcon className="text-yellow-500" />
          <span>
            <span className="font-medium">{app.stats.warnings}</span> Warnings
          </span>
        </li>
        <li className="flex items-center gap-2">
          {/* blue icon */}
          <InfoIcon className="text-blue-600" />
          <span>
            <span className="font-medium">{app.stats.infos}</span> Infos
          </span>
        </li>
      </ul>
    </CardContent>
  </Card>
);

export default ApplicationCard;
