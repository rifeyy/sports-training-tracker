"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [teamId, setTeamId] = useState("");

  const [editingAthlete, setEditingAthlete] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editSport, setEditSport] = useState("");
  const [editTeamId, setEditTeamId] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const athletesRes = await fetch("/api/athletes");
      const athletesData = await athletesRes.json();

      const teamsRes = await fetch("/api/teams");
      const teamsData = await teamsRes.json();

      setAthletes(athletesData.success ? athletesData.data || [] : []);
      setTeams(teamsData.success ? teamsData.data || [] : []);
    } catch (error) {
      console.log("LOAD ATHLETES ERROR:", error);
      toast.error("Failed to load athletes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getTeamName = (id: string) => {
    const team = teams.find((item) => item._id === id);
    return team?.name || "No team";
  };

  const filteredAthletes = useMemo(() => {
    const query = search.toLowerCase().trim();

    return athletes.filter((athlete) => {
      const athleteName = (athlete.name || "").toLowerCase();
      const athleteSport = (athlete.sport || "").toLowerCase();
      const athleteTeam = getTeamName(athlete.teamId).toLowerCase();

      return (
        query === "" ||
        athleteName.includes(query) ||
        athleteSport.includes(query) ||
        athleteTeam.includes(query)
      );
    });
  }, [athletes, search, teams]);

  const addAthlete = async () => {
    if (!name || !sport) {
      toast.error("Name and sport are required");
      return;
    }

    try {
      const res = await fetch("/api/athletes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          sport,
          teamId,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Add athlete failed");
        return;
      }

      toast.success("Athlete added");

      setName("");
      setSport("");
      setTeamId("");

      loadData();
    } catch (error) {
      console.log("ADD ATHLETE ERROR:", error);
      toast.error("Add athlete error");
    }
  };

  const openEditModal = (athlete: any) => {
    setEditingAthlete(athlete);
    setEditName(athlete.name || "");
    setEditSport(athlete.sport || "");
    setEditTeamId(athlete.teamId || "");
  };

  const closeEditModal = () => {
    setEditingAthlete(null);
    setEditName("");
    setEditSport("");
    setEditTeamId("");
  };

  const updateAthlete = async () => {
    if (!editingAthlete) return;

    if (!editName || !editSport) {
      toast.error("Name and sport are required");
      return;
    }

    try {
      const res = await fetch("/api/athletes/" + editingAthlete._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName,
          sport: editSport,
          teamId: editTeamId,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Update failed");
        return;
      }

      toast.success("Athlete updated");

      closeEditModal();
      loadData();
    } catch (error) {
      console.log("UPDATE ATHLETE ERROR:", error);
      toast.error("Update athlete error");
    }
  };

  const deleteAthlete = async (athlete: any) => {
    const confirmed = window.confirm("Delete athlete " + athlete.name + "?");

    if (!confirmed) return;

    try {
      const res = await fetch("/api/athletes/" + athlete._id, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Delete failed");
        return;
      }

      toast.success("Athlete deleted");

      setAthletes((prev) => prev.filter((item) => item._id !== athlete._id));
    } catch (error) {
      console.log("DELETE ATHLETE ERROR:", error);
      toast.error("Delete athlete error");
    }
  };

  if (loading) {
    return (
      <div className="text-white">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl animate-pulse">
          Loading athletes...
        </div>
      </div>
    );
  }

  return (
    <div className="text-white space-y-6">

      <div>
        <p className="text-gray-400 text-sm">
          Admin area
        </p>

        <h1 className="text-3xl font-bold">
          Athletes
        </h1>

        <p className="text-gray-400 mt-1">
          Manage athletes, sports and team assignments.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">

        <div className="grid md:grid-cols-5 gap-3">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search athlete..."
            className="bg-gray-800 p-3 rounded-xl outline-none"
          />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="bg-gray-800 p-3 rounded-xl outline-none"
          />

          <input
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            placeholder="Sport"
            className="bg-gray-800 p-3 rounded-xl outline-none"
          />

          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            className="bg-gray-800 p-3 rounded-xl outline-none"
          >
            <option value="">
              Select Team
            </option>

            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>

          <button
            onClick={addAthlete}
            className="bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-3 rounded-xl transition"
          >
            Add
          </button>

        </div>

      </div>

      {filteredAthletes.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center text-gray-400">
          No athletes found.
        </div>
      ) : (
        <div className="space-y-3">

          {filteredAthletes.map((athlete) => (
            <div
              key={athlete._id}
              className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-blue-500/40 transition"
            >

              <div>
                <h2 className="font-semibold">
                  {athlete.name}
                </h2>

                <p className="text-gray-400 text-sm">
                  {athlete.sport} - {getTeamName(athlete.teamId)}
                </p>
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => openEditModal(athlete)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-xl transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteAthlete(athlete)}
                  className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-xl transition"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {editingAthlete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl w-full max-w-md space-y-4">

            <div>
              <h2 className="text-xl font-bold">
                Edit Athlete
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Update athlete name, sport and team.
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-400">
                Name
              </label>

              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-gray-800 p-3 rounded-xl mt-1 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">
                Sport
              </label>

              <input
                value={editSport}
                onChange={(e) => setEditSport(e.target.value)}
                className="w-full bg-gray-800 p-3 rounded-xl mt-1 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">
                Team
              </label>

              <select
                value={editTeamId}
                onChange={(e) => setEditTeamId(e.target.value)}
                className="w-full bg-gray-800 p-3 rounded-xl mt-1 outline-none"
              >
                <option value="">
                  No team
                </option>

                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3">

              <button
                onClick={closeEditModal}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-xl transition"
              >
                Cancel
              </button>

              <button
                onClick={updateAthlete}
                className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-xl transition font-semibold"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
