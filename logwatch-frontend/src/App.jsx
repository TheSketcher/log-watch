import { useState } from "react";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-4xl">
      Tailwind läuft jetzt! 🚀🔥
    </div>
  );
}

export default App;
