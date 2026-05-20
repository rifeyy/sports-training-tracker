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

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [name, setName] = useState("");

  const fetchData = async () => {
    const t = await fetch("/api/teams").then(r => r.json());
    const a = await fetch("/api/athletes").then(r => r.json());
    const s = await fetch("/api/sessions").then(r => r.json());

    setTeams(t.data || []);
    setAthletes(a.data || []);
    setSessions(s.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addTeam = async () => {
    if (!name) return;

    await fetch("/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchData();
  };

  return (
    <div className="p-8 bg-black text-white min-h-screen">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl mb-8">🏆 Teams</h1>

        {/* ADD TEAM */}
        <div className="flex gap-3 mb-8">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Team name"
            className="bg-gray-900 border border-green-400/30 px-3 py-2 rounded-xl"
          />

          <button
            onClick={addTeam}
            className="bg-green-500 px-5 py-2 rounded-xl text-black font-bold"
          >
            ADD
          </button>
        </div>

        {/* TEAMS */}
        <div className="space-y-8">

          {teams.map((team) => {
            const players = athletes.filter(
              (a) => a.teamId === team._id
            );

            const teamSessions = sessions.filter((s) =>
              players.some((p) => p._id === s.athleteId)
            );

            const totalDuration = teamSessions.reduce(
              (sum, s) => sum + (s.duration || 0),
              0
            );

            // ✅ GROUP BY TYPE (لـ chart)
            const chartData = Object.values(
              teamSessions.reduce((acc: any, curr) => {
                if (!acc[curr.type]) {
                  acc[curr.type] = {
                    name: curr.type,
                    duration: 0,
                  };
                }
                acc[curr.type].duration += curr.duration;
                return acc;
              }, {})
            );

            return (
              <div
                key={team._id}
                className="bg-gradient-to-r from-gray-900 to-blue-900 border border-green-500/20 rounded-2xl p-6"
              >

                <h2 className="text-xl font-bold mb-2">
                  {team.name}
                </h2>

                {/* STATS */}
                <div className="flex gap-5 text-sm text-gray-300 mb-4">
                  <span>👥 {players.length}</span>
                  <span>⚡ {teamSessions.length}</span>
                  <span>⏱️ {totalDuration} min</span>
                </div>

                {/* CHART ✅🔥 */}
                {chartData.length > 0 && (
                  <div style={{ width: "100%", height: 200 }}>
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
                )}

                {/* PLAYERS */}
                <div className="mt-4 text-gray-400 text-sm">
                  {players.length === 0 && "No players"}
                  {players.map((p) => (
                    <div key={p._id}>• {p.name}</div>
                  ))}
                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}