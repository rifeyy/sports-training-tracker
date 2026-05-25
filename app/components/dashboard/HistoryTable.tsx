"use client";

import { useEffect, useState } from "react";
import SkeletonCard from "./SkeletonCard";

export default function HistoryTable() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");

      if (!userId) {
        setHistory([]);
        return;
      }

      const res = await fetch(`/api/client/metrics?userId=${userId}`);
      const data = await res.json();

      if (data.success) {
        setHistory(data.data || []);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.log("HISTORY LOAD ERROR:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();

    window.addEventListener("metricsUpdated", loadHistory);

    return () => {
      window.removeEventListener("metricsUpdated", loadHistory);
    };
  }, []);

  const clearHistory = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your history from database?"
    );

    if (!confirmed) return;

    const userId = localStorage.getItem("userId");

    if (!userId) return;

    await fetch(`/api/client/metrics?userId=${userId}`, {
      method: "DELETE",
    });

    setHistory([]);
    window.dispatchEvent(new Event("metricsUpdated"));
  };

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <div id="history-section" className="premium-card">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">

        <div>
          <h2 className="text-xl font-bold">
            History
          </h2>

          <p className="text-gray-400 text-sm">
            Measurements saved in MongoDB for this client.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-xl transition"
          >
            Clear History
          </button>
        )}

      </div>

      {history.length === 0 ? (
        <div className="border border-dashed border-gray-700 rounded-xl p-8 text-center text-gray-500">
          No history yet. Click Save Metrics to add your first entry.
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="text-gray-400 text-sm">
              <tr className="border-b border-gray-800">
                <th className="py-3">Date</th>
                <th className="py-3">Weight</th>
                <th className="py-3">Height</th>
                <th className="py-3">BMI</th>
                <th className="py-3">Calories</th>
                <th className="py-3">Goal</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition"
                >
                  <td className="py-3">{item.date}</td>
                  <td className="py-3">{item.weight}kg</td>
                  <td className="py-3">{item.height}cm</td>
                  <td className="py-3">{item.bmi}</td>
                  <td className="py-3">{item.calories} kcal</td>
                  <td className="py-3">{item.goal}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}




