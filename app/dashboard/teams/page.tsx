"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [search, setSearch] = useState("");

  const loadTeams = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/teams");
      const data = await res.json();

      setTeams(data.data || []);
    } catch (error) {
      console.log("LOAD TEAMS ERROR:", error);
      toast.error("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    const query = search.toLowerCase().trim();

    return teams.filter((team) => {
      const teamName = (team.name || "").toLowerCase();
      return query === "" || teamName.includes(query);
    });
  }, [teams, search]);

  const addTeam = async () => {
    if (!name) {
      toast.error("Team name is required");
      return;
    }

    const res = await fetch("/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (!data.success) {
      toast.error(data.message || "Add team failed");
      return;
    }

    toast.success("Team added");

    setName("");
    loadTeams();
  };

  const editTeam = async (team: any) => {
    const newName = window.prompt("New team name:", team.name);
    if (newName === null) return;

    const res = await fetch(`/api/teams/${team._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    });

    const data = await res.json();

    if (!data.success) {
      toast.error(data.message || "Update team failed");
      return;
    }

    toast.success("Team updated");
    loadTeams();
  };

  const deleteTeam = async (team: any) => {
    const confirmed = window.confirm(`Delete team ${team.name}?`);
    if (!confirmed) return;

    const res = await fetch(`/api/teams/${team._id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!data.success) {
      toast.error(data.message || "Delete team failed");
      return;
    }

    toast.success("Team deleted");

    setTeams((prev) => prev.filter((item) => item._id !== team._id));
  };

  if (loading) {
    return (
      <div className="text-white">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl animate-pulse">
          Loading teams...
        </div>
      </div>
    );
  }

  return (
    <div className="text-white space-y-6">

      <div>
        <p className="text-gray-400 text-sm">Admin area</p>
        <h1 className="text-3xl font-bold">Teams</h1>
        <p className="text-gray-400 mt-1">
          Manage teams and group athletes efficiently.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">

        <div className="grid md:grid-cols-3 gap-3">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team..."
            className="bg-gray-800 p-3 rounded-xl outline-none"
          />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Team name"
            className="bg-gray-800 p-3 rounded-xl outline-none"
          />

          <button
            onClick={addTeam}
            className="bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-3 rounded-xl transition"
          >
            Add
          </button>

        </div>

      </div>

      {filteredTeams.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center text-gray-400">
          No teams found.
        </div>
      ) : (
        <div className="space-y-3">

          {filteredTeams.map((team) => (
            <div
              key={team._id}
              className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-blue-500/40 transition"
            >

              <div>
                <h2 className="font-semibold">
                  {team.name}
                </h2>

                <p className="text-gray-400 text-sm">
                  Team ID: {team._id}
                </p>
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => editTeam(team)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-xl transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTeam(team)}
                  className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-xl transition"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}