"use client";

import { useState } from "react";

export default function RegisterPage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white">

      {/* LOGO */}
      <div className="absolute top-10 text-center">
        <h1 className="text-2xl font-bold">⚡ AthleteOS</h1>
        <p className="text-gray-400 text-sm">Create your account</p>
      </div>

      {/* CARD */}
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-80 shadow-xl animate-fade">

        <h2 className="text-xl mb-6 font-semibold text-center">Register</h2>

        <input
          placeholder="Nom complet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-800 text-white p-2 w-full rounded mb-3 outline-none focus:ring-2 ring-blue-500"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-800 text-white p-2 w-full rounded mb-3 outline-none focus:ring-2 ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-800 text-white p-2 w-full rounded mb-4 outline-none focus:ring-2 ring-blue-500"
        />

        <button
          onClick={register}
          className="bg-blue-500 hover:bg-blue-400 transition w-full py-2 rounded font-semibold"
        >
          Create Account
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Already have account ?{" "}
          <a href="/login" className="text-green-400">Login</a>
        </p>

      </div>

    </div>
  );
}
