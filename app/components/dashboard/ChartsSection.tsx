"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, BarChart, Bar
} from "recharts";

export default function ChartsSection() {

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("history");

    if (saved) {
      const weights = JSON.parse(saved);

      const formatted = weights.map((w:number, i:number) => ({
        day: "Day " + (i + 1),
        weight: w,
        calories: 2500 - (i * 100),
      }));

      setData(formatted);
    }
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* ✅ Weight */}
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2>📉 Weight Progress</h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line dataKey="weight" stroke="#22c55e" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Calories */}
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2>🔥 Calories</h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="calories" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
