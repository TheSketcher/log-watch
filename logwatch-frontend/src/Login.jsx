import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [tab, setTab] = useState("login"); // 'login' oder 'register'
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (tab === "login") {
        const response = await axios.post(`${apiUrl}/auth/login`, {
          username,
          password,
        });

        console.log("Login successful:", response.data);
        if (onLogin) onLogin(response.data);
      } else {
        const response = await axios.post(`${apiUrl}/users`, {
          username,
          email,
          password,
        });

        console.log("User registered:", response.data);
        if (onLogin) onLogin(response.data);
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
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          {tab === "register" && (
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            {tab === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
