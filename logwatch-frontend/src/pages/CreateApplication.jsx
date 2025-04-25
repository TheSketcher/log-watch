import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import api from "@/api/axios";
import { v4 as uuid } from "uuid";

const CreateApplication = () => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Generate API Key on mount
  useEffect(() => {
    const key = uuid().replace(/-/g, "").slice(0, 24);
    setApiKey(key);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/applications", { name, comment, apiKey });
      navigate("/dashboard", { replace: true }); // auto-close
    } catch (err) {
      console.error("Failed to create application", err);
      setError("Failed to create application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Card className="max-w-xl mx-auto">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-6">
            Create New Application
          </h2>

          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="My Microservice"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Comment (optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                rows={4}
                placeholder="Description, team owner, notes …"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">
                API Key (auto‑generated)
              </label>
              <Input value={apiKey} readOnly className="bg-gray-100" />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="ghost"
                type="button"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating…" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default CreateApplication;
