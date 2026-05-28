"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [athleteId, setAthleteId] = useState("");
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [hour, setHour] = useState("");
  const [day, setDay] = useState("Monday");
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const sessionsRes = await fetch("/api/sessions");
      const sessionsData = await sessionsRes.json();

      const athletesRes = await fetch("/api/athletes");
      const athletesData = await athletesRes.json();

      setSessions(sessionsData.data || []);
      setAthletes(athletesData.data || []);
    } catch (error) {
      console.log("LOAD SESSIONS ERROR:", error);
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getAthleteName = (id: string) => {
    const athlete = athletes.find((item) => item._id === id);
    return athlete?.name || "Unknown";
  };

  const filteredSessions = useMemo(() => {
    const query = search.toLowerCase().trim();

    return sessions.filter((session) => {
      const athleteName = getAthleteName(session.athleteId).toLowerCase();
      const sessionType = (session.type || "").toLowerCase();
      const sessionDay = (session.day || "").toLowerCase();

      return (
        query === "" ||
        athleteName.includes(query) ||
        sessionType.includes(query) ||
        sessionDay.includes(query)
      );
    });
  }, [sessions, search, athletes]);

  const addSession = async () => {
    if (!athleteId || !type || !duration) {
      toast.error("Athlete, type and duration are required");
      return;
    }

    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        athleteId,
        type,
        duration,
        day,
        hour,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      toast.error(data.message || "Add session failed");
      return;
    }

    toast.success("Session added");

    setAthleteId("");
    setType("");
    setDuration("");
    setHour("");
    setDay("Monday");

    loadData();
  };

  const deleteSession = async (session: any) => {
    const confirmed = window.confirm("Delete this session?");
    if (!confirmed) return;

    const res = await fetch(`/api/sessions/${session._id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!data.success) {
      toast.error(data.message || "Delete failed");
      return;
    }

    toast.success("Session deleted");

    setSessions((prev) => prev.filter((item) => item._id !== session._id));
  };

  if (loading) {
    return (
      <div className="text-white">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl animate-pulse">
          Loading sessions...
        </div>
      </div>
    );
  }

  return (
    <div className="text-white space-y-6">

      <div>
        <p className="text-gray-400 text-sm">Admin area</p>
        <h1 className="text-3xl font-bold">Sessions</h1>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
        <div className="grid md:grid-cols-6 gap-3">

          <select
            value={athleteId}
            onChange={(e) => setAthleteId(e.target.value)}
            className="bg-gray-800 p-3 rounded-xl"
          >
            <option value="">Select Athlete</option>
            {athletes.map((athlete) => (
              <option key={athlete._id} value={athlete._id}>
                {athlete.name}
              </option>
            ))}
          </select>

          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Type"
            className="bg-gray-800 p-3 rounded-xl"
          />

          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration"
            className="bg-gray-800 p-3 rounded-xl"
          />

          <input
            type="time"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="bg-gray-800 p-3 rounded-xl"
          />

          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="bg-gray-800 p-3 rounded-xl"
          >
            {days.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <button
            onClick={addSession}
            className="bg-green-500 px-4 py-3 rounded-xl"
          >
            Add
          </button>

        </div>
      </div>

      <div className="space-y-3">
        {filteredSessions.map((session) => (
          <div key={session._id} className="bg-gray-900 p-4 rounded-xl flex justify-between">

            <div>
              <h2>
                {getAthleteName(session.athleteId)} - {session.type}
              </h2>

              <p>
                Duration: {session.duration} min | Day: {session.day} | Hour: {session.hour || "-"} 
              </p>
            </div>

            <button
              onClick={() => deleteSession(session)}
              className="bg-red-500 px-3 py-2 rounded-lg"
            >
              Delete
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}
