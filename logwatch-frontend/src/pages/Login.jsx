import { useState } from "react";
import axios from "axios";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useNavigate } from "react-router-dom";
import { login as saveToken } from "@/utils/auth";

export default function LoginPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (tab === "login") {
        const { data } = await axios.post(`${apiUrl}/auth/login`, {
          username,
          password,
        });
        saveToken(data.token || "demo-token");
        if (onLogin) onLogin(data);
        navigate("/dashboard", { replace: true });
      } else {
        const { data } = await axios.post(`${apiUrl}/users`, {
          username,
          email,
          password,
        });
        saveToken(data.token || "demo-token");
        if (onLogin) onLogin(data);
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error(`${tab} failed:`, err.message);
      setError(`${tab === "login" ? "Login" : "Registration"} failed.`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 rounded-l-lg ${
              tab === "login"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-r-lg ${
              tab === "register"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setTab("register")}
          >
            Register
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Username</label>
            <Input
              type="text"
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
          <Button type="submit" className="w-full">
            {tab === "login" ? "Login" : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
