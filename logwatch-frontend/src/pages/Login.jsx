import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api/axios";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function Login({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { login: ctxLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (tab === "login") {
        const { data } = await api.post("/auth/login", { username, password });
        // backend returns { access_token, user }
        ctxLogin(data.access_token, data.user);
      } else {
        const { data } = await api.post("/users", {
          username,
          email,
          password,
        });
        ctxLogin(data.access_token, data.user);
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(`${tab} failed`, err);
      setError(tab === "login" ? "Invalid credentials" : "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        {/* Tab buttons */}
        <div className="flex mb-6">
          {["login", "register"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-2 first:rounded-l-lg last:rounded-r-lg ${
                tab === t
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {t === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {tab === "register" && (
            <div>
              <label className="block text-gray-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait…" : tab === "login" ? "Login" : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
