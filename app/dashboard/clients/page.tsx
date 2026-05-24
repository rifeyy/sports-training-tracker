"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [goalFilter, setGoalFilter] = useState("All");
  const [activityFilter, setActivityFilter] = useState("All");

  const fetchClients = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/clients");
      const data = await res.json();

      if (data.success) {
        setClients(data.data || []);
      } else {
        setClients([]);
      }
    } catch (error) {
      console.log("CLIENTS LOAD ERROR:", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const profile = client.profile;
      const metric = client.latestMetric;

      const name = (profile?.name || "No profile").toLowerCase();
      const email = (profile?.email || client.email || "").toLowerCase();

      const goal = profile?.goal || metric?.goal || "Not set";
      const activity = profile?.activity || metric?.activity || "Not set";

      const query = search.trim().toLowerCase();

      const matchesSearch =
        query === "" ||
        name.includes(query) ||
        email.includes(query);

      const matchesGoal =
        goalFilter === "All" || goal === goalFilter;

      const matchesActivity =
        activityFilter === "All" || activity === activityFilter;

      return matchesSearch && matchesGoal && matchesActivity;
    });
  }, [clients, search, goalFilter, activityFilter]);

  const clearFilters = () => {
    setSearch("");
    setGoalFilter("All");
    setActivityFilter("All");
  };

  if (loading) {
    return (
      <div className="text-white">
        <h1 className="text-2xl font-bold mb-6">Clients</h1>

        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 p-6 rounded-xl animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <p className="text-gray-400 text-sm">Admin area</p>

          <h1 className="text-3xl font-bold">
            Clients Overview
          </h1>

          <p className="text-gray-400 mt-1">
            Monitor client profiles, latest measurements and progress activity.
          </p>
        </div>

        <button
          onClick={fetchClients}
          className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-xl transition"
        >
          Refresh
        </button>

      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl mb-6">

        <div className="grid md:grid-cols-4 gap-4">

          <div>
            <label className="text-sm text-gray-400">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-gray-800 p-3 rounded-xl mt-1 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Goal</label>
            <select
              value={goalFilter}
              onChange={(e) => setGoalFilter(e.target.value)}
              className="w-full bg-gray-800 p-3 rounded-xl mt-1 outline-none"
            >
              <option>All</option>
              <option>Maintain</option>
              <option>Lose Weight</option>
              <option>Gain Muscle</option>
              <option>Not set</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Activity</label>
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="w-full bg-gray-800 p-3 rounded-xl mt-1 outline-none"
            >
              <option>All</option>
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
              <option>Not set</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-xl transition"
            >
              Clear Filters
            </button>
          </div>

        </div>

        <p className="text-gray-500 text-sm mt-4">
          Showing {filteredClients.length} of {clients.length} clients
        </p>

      </div>

      {clients.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center text-gray-400">
          No clients found.
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center text-gray-400">
          No clients match your filters.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredClients.map((client) => {
            const profile = client.profile;
            const metric = client.latestMetric;

            const goal = profile?.goal || metric?.goal || "Not set";
            const activity = profile?.activity || metric?.activity || "Not set";

            return (
              <div
                key={client.userId}
                className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-blue-500/40 hover:-translate-y-1 transition"
              >

                <div className="mb-5">

                  <p className="text-gray-400 text-sm">
                    Client
                  </p>

                  <h2 className="text-xl font-bold">
                    {profile?.name || "No profile"}
                  </h2>

                  <p className="text-gray-400 text-sm mt-1">
                    {profile?.email || client.email}
                  </p>

                </div>

                <div className="flex gap-2 flex-wrap mb-5">

                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                    Goal: {goal}
                  </span>

                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                    Activity: {activity}
                  </span>

                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">

                  <div className="bg-gray-800 p-4 rounded-xl">
                    <p className="text-xs text-gray-400">Latest Weight</p>
                    <h3 className="text-lg font-bold">
                      {metric ? `${metric.weight}kg` : "—"}
                    </h3>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-xl">
                    <p className="text-xs text-gray-400">BMI</p>
                    <h3 className="text-lg font-bold text-green-400">
                      {metric ? metric.bmi : "—"}
                    </h3>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-xl">
                    <p className="text-xs text-gray-400">Entries</p>
                    <h3 className="text-lg font-bold">
                      {client.stats.entries}
                    </h3>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-xl">
                    <p className="text-xs text-gray-400">Photos</p>
                    <h3 className="text-lg font-bold">
                      {client.stats.photos}
                    </h3>
                  </div>

                </div>

                <div className="flex justify-between items-center">

                  <p className="text-xs text-gray-500">
                    ID: {client.userId.slice(0, 8)}...
                  </p>

                  <Link
                    href={`/dashboard/clients/${client.userId}`}
                    className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-xl transition"
                  >
                    View Details
                  </Link>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}
