"use client";

import { useEffect, useState } from "react";

export default function AthletesPage() {
  const [data, setData] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [teamId, setTeamId] = useState("");

  const fetchData = async () => {
    const res = await fetch("/api/athletes");
    const json = await res.json();
    setData(json.data || []);

    const t = await fetch("/api/teams").then(r => r.json());
    setTeams(t.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addAthlete = async () => {
    await fetch("/api/athletes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, sport, teamId }),
    });

    setName("");
    setSport("");
    setTeamId("");
    fetchData();
  };

  const getTeamName = (id: string) => {
    const t = teams.find(x => x._id === id);
    return t ? t.name : "No team";
  };

  return (
    <div className="p-8 bg-black text-white min-h-screen">

      <h1 className="text-3xl mb-6">Athletes</h1>

<input
  placeholder="Search athlete..."
  onChange={(e) => setSearch(e.target.value)}
  className="bg-gray-900 px-3 py-2 rounded-xl border border-green-400/30 mb-4"
/>

      <div className="flex gap-3 mb-6">

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="bg-gray-900 border border-green-400/30 px-3 py-2 rounded-xl"
        />

        <input
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          placeholder="Sport"
          className="bg-gray-900 border border-green-400/30 px-3 py-2 rounded-xl"
        />

        <select
          onChange={(e) => setTeamId(e.target.value)}
          className="bg-gray-900 border border-green-400/30 px-3 py-2 rounded-xl"
        >
          <option>Select Team</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>

        <button
          onClick={addAthlete}
          className="bg-green-500 px-4 py-2 rounded-xl"
        >
          ADD
        </button>

      </div>

      <div className="space-y-3">
        {data.map((a) => (
          <div key={a._id} className="bg-gray-800 p-3 rounded-xl">
            {a.name} - {a.sport} ({getTeamName(a.teamId)})
          </div>
        ))}
      </div>

    </div>
  );
}
