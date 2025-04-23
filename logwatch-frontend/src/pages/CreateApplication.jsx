// ===================== src/pages/CreateApplication.jsx ============
// Page for creating a new application (name + comment). The component
// auto‑generates `createdAt` and a 24‑character API‑key on submit.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { v4 as uuid } from "uuid";

const CreateApplication = () => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [apiKey, setApiKey] = useState("");
  const navigate = useNavigate();

  // Create a 24‑char key (uuid v4 without dashes) – replace with backend‑issued one if needed.
  const generateApiKey = () => uuid().replace(/-/g, "").slice(0, 24);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newApp = {
      id: Date.now().toString(), // temporary placeholder
      name,
      comment,
      createdAt: new Date().toISOString(),
      apiKey: generateApiKey(),
    };

    console.log("Creating app", newApp);
    // TODO: POST newApp to backend → /applications

    // redirect to dashboard once done
    navigate("/dashboard", { replace: true });
  };

  return (
    <AppLayout>
      <Card className="max-w-xl mx-auto">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-6">
            Create New Application
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field */}
            <div>
              <label className="block mb-1 text-sm">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="My Microservice"
              />
            </div>

            {/* Comment field */}
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

            {/* Display API key after submit */}
            {apiKey && (
              <div>
                <label className="block mb-1 text-sm">API Key</label>
                <Input value={apiKey} readOnly className="bg-gray-100" />
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="ghost"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default CreateApplication;
