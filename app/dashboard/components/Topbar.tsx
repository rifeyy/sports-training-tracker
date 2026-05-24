"use client";

export default function Topbar() {
  const logout = () => {
    localStorage.clear();

    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    document.cookie = "userId=; path=/; max-age=0";

    window.location.href = "/login";
  };

  return (
    <div className="flex justify-between items-center bg-gray-900 border border-gray-800 p-4 rounded-xl mb-6 text-white">

      <div>
        <h1 className="text-lg font-semibold">
          Admin Dashboard
        </h1>

        <p className="text-gray-400 text-sm">
          Manage athletes, teams, sessions and statistics.
        </p>
      </div>

      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-xl transition text-white"
      >
        Logout
      </button>

    </div>
  );
}
