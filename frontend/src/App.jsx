// "use client"
// import React from 'react'

// import { useState, useEffect } from "react"
// import Login from "./components/Login"
// import Dashboard from "./components/Dashboard"

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [user, setUser] = useState(null)

//   useEffect(() => {
//     // Check if user is logged in (check localStorage or token)
//     const token = localStorage.getItem("token")
//     const userData = localStorage.getItem("user")

//     if (token && userData) {
//       setIsAuthenticated(true)
//       setUser(JSON.parse(userData))
//     }
//   }, [])

//   const handleLogin = (userData) => {
//     setIsAuthenticated(true)
//     setUser(userData)
//     localStorage.setItem("user", JSON.stringify(userData))
//   }

//   const handleLogout = () => {
//     setIsAuthenticated(false)
//     setUser(null)
//     localStorage.removeItem("token")
//     localStorage.removeItem("user")
//   }

//   return (
//     <div className="min-h-screen bg-gray-900">
//       {!isAuthenticated ? <Login onLogin={handleLogin} /> : <Dashboard user={user} onLogout={handleLogout} />}
//     </div>
//   )
// }

// export default App



"use client";
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Failed to parse user data from localStorage:", err);
        localStorage.removeItem("user"); // Clear bad data
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
