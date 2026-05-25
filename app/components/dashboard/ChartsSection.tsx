"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function ChartsSection() {
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
      console.log("CHART LOAD ERROR:", error);
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

  if (loading) {
    return (
      <div className="premium-card animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-800 rounded-xl"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="premium-card">
        <h2 className="text-xl font-bold mb-2">Progress Charts</h2>
        <p className="text-gray-400">
          No data yet. Click Save Metrics to start tracking your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <div className="premium-card">

        <h2 className="text-xl font-bold mb-4">
          Weight Progress
        </h2>

        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className="premium-card">

        <h2 className="text-xl font-bold mb-4">
          Calories
        </h2>

        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="calories"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}




