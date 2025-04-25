import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/Dialog";
import { toast } from "sonner";
import api from "@/api/axios";

const ApplicationSettings = ({ app }) => {
  const [name, setName] = useState(app.name);
  const [status, setStatus] = useState(app.status || "Active");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleRename = async () => {
    setIsSaving(true);
    try {
      await api.patch(`/applications/${app._id}`, { name });
      toast.success("Application renamed successfully");
    } catch (err) {
      console.error("Rename failed", err);
      toast.error("Failed to rename");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = status === "Active" ? "Paused" : "Active";
    try {
      await api.patch(`/applications/${app._id}`, { status: newStatus });
      setStatus(newStatus);
      toast(`Application ${newStatus === "Paused" ? "paused" : "resumed"}`);
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/applications/${app._id}`);
      toast.success("Application deleted");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete application");
    }
  };

  return (
    <div className="space-y-6">
      {/* Rename App */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Rename Application</h2>
          <div className="flex gap-2 items-center">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <Button onClick={handleRename} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pause/Resume Logging */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Logging Status</h2>
          <p>
            Current Status: <strong>{status}</strong>
          </p>
          <Button variant="outline" onClick={handleToggleStatus}>
            {status === "Active" ? "Pause Logging" : "Resume Logging"}
          </Button>
        </CardContent>
      </Card>

      {/* Dangerous Delete Action */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold mb-2 text-red-600">
            Delete Application
          </h2>
          <p className="text-gray-500">
            This action cannot be undone. All logs and settings will be lost.
          </p>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Application</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <h2 className="text-lg font-semibold text-red-600">
                  Confirm Deletion
                </h2>
                <p className="text-sm text-gray-500">
                  Are you sure you want to permanently delete{" "}
                  <strong>{app.name}</strong>?
                </p>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationSettings;
