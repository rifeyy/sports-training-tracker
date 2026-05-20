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

export default function Dashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [selected, setSelected] = useState("all");

  const fetchData = async () => {
    const s = await fetch("/api/sessions").then(res => res.json());
    const a = await fetch("/api/athletes").then(res => res.json());

    setSessions(s.data || []);
    setAthletes(a.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered =
    selected === "all"
      ? sessions
      : sessions.filter(s => s.athleteId === selected);

  const totalSessions = filtered.length;

  const totalDuration = filtered.reduce(
    (sum, s) => sum + (s?.duration || 0),
    0
  );

  const grouped = Object.values(
    filtered.reduce((acc: any, curr) => {
      if (!acc[curr.type]) {
        acc[curr.type] = { name: curr.type, duration: 0 };
      }
      acc[curr.type].duration += curr.duration;
      return acc;
    }, {})
  );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Dashboard
        </h1>

        <select
          onChange={(e) => setSelected(e.target.value)}
          className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg"
        >
          <option value="all">All Athletes</option>
          {athletes.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

        {[{
          title: "Sessions",
          value: totalSessions
        },
        {
          title: "Duration",
          value: totalDuration + " min"
        },
        {
          title: "Average",
          value: totalSessions
            ? Math.round(totalDuration / totalSessions) + " min"
            : "0"
        },
        {
          title: "Athletes",
          value: athletes.length
        }].map((c, i) => (

          <div
            key={i}
            className="p-6 rounded-2xl bg-gray-800 border border-gray-700 hover:scale-[1.03] hover:shadow-xl transition"
          >
            <p className="text-gray-400 text-sm">
              {c.title}
            </p>
            <p className="text-3xl font-bold mt-2">
              {c.value}
            </p>
          </div>

        ))}

      </div>

      {/* CHART */}
      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">

        <h2 className="mb-6 text-lg text-gray-300">
          Sessions by Type
        </h2>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={grouped}>
              <XAxis stroke="#9CA3AF" dataKey="name" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Bar
                dataKey="duration"
                fill="#6366f1"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}
