import { useState } from "react";
import Login from "./Login";

import "./index.css";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (credentials) => {
    // Hier später API Call, jetzt einfach speichern:
    console.log("Login submitted:", credentials);
    setUser(credentials);
  };

  return (
    <div>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user.username}!
          </h1>
        </div>
      )}
    </div>
  );
}

export default App;
