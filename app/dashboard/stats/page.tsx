"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StatsPage() {
  const [sessions, setSessions] = useState<any[]>([]);

  const fetchData = async () => {
    const res = await fetch("/api/sessions");
    const data = await res.json();
    setSessions(data.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalSessions = sessions.length;

  const totalDuration = sessions.reduce(
    (sum, s) => sum + (s.duration || 0),
    0
  );

  // ✅ group by type
  const chartData = Object.values(
    sessions.reduce((acc: any, curr) => {
      if (!acc[curr.type]) {
        acc[curr.type] = { name: curr.type, duration: 0 };
      }
      acc[curr.type].duration += curr.duration;
      return acc;
    }, {})
  );

  return (
    <div className="p-8 bg-black min-h-screen text-white">

      <h1 className="text-4xl font-bold mb-8">
        📊 STATISTICS
      </h1>

      {/* ✅ CARDS */}
      <div className="grid grid-cols-2 gap-6 mb-10">

        <div className="bg-gray-900 border border-green-500/20 p-6 rounded-2xl">
          <p className="text-gray-400">Total Sessions</p>
          <p className="text-3xl font-bold">{totalSessions}</p>
        </div>

        <div className="bg-gray-900 border border-green-500/20 p-6 rounded-2xl">
          <p className="text-gray-400">Total Duration</p>
          <p className="text-3xl font-bold">
            {totalDuration} min
          </p>
        </div>

      </div>

      {/* ✅ CHART */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 border border-green-500/20 p-6 rounded-3xl">

        <h2 className="text-xl mb-6">
          Sessions by Type
        </h2>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar
                dataKey="duration"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}




