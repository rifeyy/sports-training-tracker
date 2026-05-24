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
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Login failed");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("role", data.role);
    localStorage.setItem("email", cleanEmail);

    document.cookie = `token=${data.token}; path=/`;
    document.cookie = `role=${data.role}; path=/`;
    document.cookie = `userId=${data.user.id}; path=/`;

    if (data.role === "admin") {
      window.location.href = "/dashboard";
    } else if (data.role === "client") {
      window.location.href = "/client";
    } else {
      alert("Invalid role");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="bg-gray-900 p-6 rounded-xl w-80">

        <h1 className="mb-4 text-center text-xl font-bold">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 bg-gray-800 rounded outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 bg-gray-800 rounded outline-none"
        />

        <button
          onClick={login}
          className="bg-green-500 hover:bg-green-400 transition w-full py-2 rounded text-black font-semibold"
        >
          Login
        </button>

      </div>

    </div>
  );
}
