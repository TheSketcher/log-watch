import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";
import { ErrorIcon, WarningIcon, InfoIcon } from "@/components/ui/icons";

const ApplicationCard = ({ app }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Navigating to:", `/applications/${app._id}/overview`);
    navigate(`/applications/${app._id}/overview`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card className="cursor-pointer hover:shadow-lg transition-shadow user-select-none">
        <CardContent className="space-y-2">
          <h3 className="text-lg font-semibold">{app.name}</h3>
          <p className="text-xs text-gray-500">
            Created: {new Date(app.createdAt).toLocaleDateString()}
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-red-500">
              <ErrorIcon /> {app.stats?.errors || 0} Errors
            </div>
            <div className="flex items-center gap-2 text-yellow-500">
              <WarningIcon /> {app.stats?.warnings || 0} Warnings
            </div>
            <div className="flex items-center gap-2 text-blue-500">
              <InfoIcon /> {app.stats?.infos || 0} Infos
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationCard;
