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
import { Eye, EyeOff, Copy, RefreshCcw } from "lucide-react";
import api from "@/api/axios";

const ApplicationSettings = ({ app }) => {
  const [name, setName] = useState(app.name);
  const [status, setStatus] = useState(app.status || "Active");
  const [apiKey, setApiKey] = useState(app.apiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const [retentionDays, setRetentionDays] = useState(app.retentionDays || 30);

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

  const handleCopyApiKey = async () => {
    await navigator.clipboard.writeText(apiKey);
    toast.success("API Key copied to clipboard");
  };

  const handleRegenerateApiKey = async () => {
    try {
      const { data } = await api.post(
        `/applications/${app._id}/regenerate-key`
      );
      setApiKey(data.apiKey);
      setShowApiKey(true);
      toast.success("API Key regenerated successfully");
    } catch (err) {
      console.error("Failed to regenerate API key", err);
      toast.error("Failed to regenerate API key");
    } finally {
      setShowRegenerateDialog(false);
    }
  };
  const handleRetentionChange = async (days) => {
    try {
      await api.patch(`/applications/${app._id}`, { retentionDays: days });
      setRetentionDays(days);
      toast.success(
        `Log retention set to ${days === 0 ? "forever" : `${days} days`}`
      );
    } catch (err) {
      console.error("Failed to update retention", err);
      toast.error("Failed to update log retention");
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
      {/* Log Retention Settings */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Log Retention</h2>
          <p className="text-sm text-gray-500">
            Choose how long logs should be retained. If set to 0, logs will be
            kept forever.
          </p>

          <div className="flex gap-2">
            {[30, 60, 90].map((days) => (
              <Button
                key={days}
                variant="outline"
                onClick={() => handleRetentionChange(days)}
              >
                {days} Days
              </Button>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min={0}
              value={retentionDays}
              onChange={(e) => setRetentionDays(Number(e.target.value))}
            />
            <Button onClick={() => handleRetentionChange(retentionDays)}>
              Save Retention
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Key Section */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">API Key</h2>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm break-all">
              {showApiKey ? apiKey : "••••••••••••••••••••••"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCopyApiKey}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <Dialog
            open={showRegenerateDialog}
            onOpenChange={setShowRegenerateDialog}
          >
            <DialogTrigger asChild>
              <Button variant="destructive" className="mt-2">
                <RefreshCcw className="w-4 h-4 mr-2" /> Regenerate API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <h2 className="text-lg font-semibold text-red-600">
                  Confirm API Key Regeneration
                </h2>
                <p className="text-sm text-gray-500">
                  Are you sure you want to regenerate the API key? The old key
                  will stop working immediately.
                </p>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setShowRegenerateDialog(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleRegenerateApiKey}>
                  Regenerate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
