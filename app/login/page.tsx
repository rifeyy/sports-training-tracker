"use client";

import { useState } from "react";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("role", data.role);
localStorage.setItem("role", data.role);
document.cookie = `token=${data.token}; path=/`;
      
if (data.role === "admin") {
  window.location.href = "/dashboard";
} else {
  window.location.href = "/client";
}

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white">

      {/* LOGO */}
      <div className="absolute top-10 text-center">
        <h1 className="text-2xl font-bold">? AthleteOS</h1>
        <p className="text-gray-400 text-sm">Train smarter</p>
      </div>

      {/* CARD */}
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-80 shadow-xl animate-fade">

        <h2 className="text-xl mb-6 font-semibold text-center">Login</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-800 text-white p-2 w-full rounded mb-4 outline-none focus:ring-2 ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-800 text-white p-2 w-full rounded mb-4 outline-none focus:ring-2 ring-blue-500"
        />

        <button
          onClick={login}
          className="bg-green-500 hover:bg-green-400 transition w-full py-2 rounded font-semibold"
        >
          Login
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          No account ?{" "}
          <a href="/register" className="text-blue-400">Register</a>
        </p>

      </div>

    </div>
  );
}
