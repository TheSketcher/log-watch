import React from "react";
import { Card, CardContent } from "@/components/ui/Card";

const ApplicationCard = ({ app }) => (
  <Card className="transition-transform hover:scale-[1.02] hover:shadow-lg">
    <CardContent>
      <h3 className="text-xl font-semibold mb-4">{app.name}</h3>
      <ul className="space-y-1 text-sm text-gray-700">
        <li>
          <span className="font-medium">{app.stats.errors}</span> Errors
        </li>
        <li>
          <span className="font-medium">{app.stats.warnings}</span> Warnings
        </li>
        <li>
          <span className="font-medium">{app.stats.infos}</span> Infos
        </li>
      </ul>
    </CardContent>
  </Card>
);

export default ApplicationCard;
