"use client";

import { useEffect, useState } from "react";

export default function ClientSummary() {
  const [weight, setWeight] = useState("Not set");
  const [goal, setGoal] = useState("Maintain");
  const [activity, setActivity] = useState("Moderate");
  const [historyCount, setHistoryCount] = useState(0);

  const loadData = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    const profileRes = await fetch(`/api/client/profile?userId=${userId}`);
    const profileData = await profileRes.json();

    if (profileData.success && profileData.data) {
      setGoal(profileData.data.goal || "Maintain");
      setActivity(profileData.data.activity || "Moderate");
    }

    const res = await fetch(`/api/client/metrics?userId=${userId}`);
    const data = await res.json();

    if (data.success && data.data.length > 0) {
      const history = data.data;
      const latest = history[history.length - 1];

      setWeight(String(latest.weight));
      setHistoryCount(history.length);
    } else {
      setWeight("Not set");
      setHistoryCount(0);
    }
  };

  useEffect(() => {
    loadData();

    window.addEventListener("metricsUpdated", loadData);

    return () => {
      window.removeEventListener("metricsUpdated", loadData);
    };
  }, []);

  return (
    <div className="premium-card">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div>
          <p className="text-sm text-gray-400 mb-1">
            Client overview
          </p>

          <h1 className="text-3xl font-bold">
            Your fitness dashboard
          </h1>

          <p className="text-gray-400 mt-2 max-w-2xl">
            Track your health metrics, training progress, nutrition focus and transformation journey from one place.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          <div className="bg-gray-800/70 p-4 rounded-xl">
            <p className="text-xs text-gray-400">Current Weight</p>
            <h3 className="text-lg font-bold">
              {weight === "Not set" ? weight : `${weight}kg`}
            </h3>
          </div>

          <div className="bg-gray-800/70 p-4 rounded-xl">
            <p className="text-xs text-gray-400">Goal</p>
            <h3 className="text-lg font-bold text-blue-400">{goal}</h3>
          </div>

          <div className="bg-gray-800/70 p-4 rounded-xl">
            <p className="text-xs text-gray-400">Activity</p>
            <h3 className="text-lg font-bold text-green-400">{activity}</h3>
          </div>

          <div className="bg-gray-800/70 p-4 rounded-xl">
            <p className="text-xs text-gray-400">Entries</p>
            <h3 className="text-lg font-bold">{historyCount}</h3>
          </div>

        </div>

      </div>

    </div>
  );
}





