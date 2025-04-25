import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import ApplicationTopBar from "@/components/ApplicationTopBar";
import ApplicationTabs from "@/components/ApplicationTabs";
import ApplicationMainContent from "@/components/ApplicationMainContent";
import api from "@/api/axios";
import { toast } from "sonner";

const ApplicationDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const { data } = await api.get(`/applications/${id}`);
        setApp(data);
      } catch (err) {
        console.error("Failed to fetch application", err);
        toast.error("Failed to load application");
        navigate("/dashboard", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [id, navigate]);

  const handleRegenerateApiKey = async () => {
    try {
      const { data } = await api.post(`/applications/${id}/regenerate-key`);
      setApp((prev) => ({ ...prev, apiKey: data.apiKey }));
      toast.success("API Key regenerated");
    } catch (err) {
      console.error("Failed to regenerate API key", err);
      toast.error("Failed to regenerate API Key");
    }
  };

  if (loading)
    return <p className="text-gray-500 p-8">Loading application...</p>;
  if (!app) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <ApplicationTopBar
          app={app}
          onRegenerateApiKey={handleRegenerateApiKey}
        />
        <ApplicationTabs basePath={`/applications/${app._id}`} />
        <ApplicationMainContent app={app} />
      </div>
    </AppLayout>
  );
};

export default ApplicationDashboard;
