"use client";

import toast from "react-hot-toast";

export default function ClientNav() {
  const logout = () => {
    localStorage.clear();

    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    document.cookie = "userId=; path=/; max-age=0";
    document.cookie = "userId=; path=/; max-age=0";

    toast.success("Logged out successfully");

    setTimeout(() => {
      window.location.href = "/login";
    }, 600);
  };

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="premium-card flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <div>
        <p className="section-kicker">
          AthleteOS Client Area
        </p>

        <h2 className="section-title">
          Personal Fitness Space
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">

        <button
          onClick={goHome}
          className="btn-premium bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl"
        >
          Home
        </button>

        <button
          onClick={logout}
          className="btn-premium bg-red-500 hover:bg-red-400 px-4 py-2 rounded-xl text-white"
        >
          Logout
        </button>

      </div>

    </div>
  );
}


