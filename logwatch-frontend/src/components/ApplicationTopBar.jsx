import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/Dialog";
import { toast } from "sonner";
import { CopyIcon, RefreshCwIcon } from "lucide-react";

const ApplicationTopBar = ({ app, onRegenerateApiKey }) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(app.apiKey);
    toast("API Key copied to clipboard");
  };

  const handleRegenerate = () => {
    setShowDialog(false);
    onRegenerateApiKey?.();
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 border-b pb-4">
      {/* App Name + Status */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{app.name}</h1>
        <Badge variant="outline">{app.status || "Active"}</Badge>
      </div>

      {/* API Key Display + Actions */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2 w-full md:w-96">
          <Input value={app.apiKey} readOnly className="text-xs" />
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            <CopyIcon className="w-4 h-4" />
          </Button>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <RefreshCwIcon className="w-4 h-4 mr-2" /> Regenerate API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <h2 className="text-lg font-semibold">Regenerate API Key?</h2>
              <p className="text-sm text-gray-500">
                This will invalidate the current key. Make sure to update your
                application.
              </p>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRegenerate}>
                Regenerate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Meta Info */}
      <div className="text-sm text-gray-500">
        <p>Created: {new Date(app.createdAt).toLocaleDateString()}</p>
        <p>
          Last Log:{" "}
          {app.lastLogAt
            ? new Date(app.lastLogAt).toLocaleString()
            : "No logs yet"}
        </p>
      </div>
    </div>
  );
};

export default ApplicationTopBar;
