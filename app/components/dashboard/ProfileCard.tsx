"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

export default function ProfileCard() {
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("client@gmail.com");
  const [age, setAge] = useState("22");
  const [goal, setGoal] = useState("Maintain");
  const [activity, setActivity] = useState("Moderate");

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");

      if (!userId) return;

      const res = await fetch(`/api/client/profile?userId=${userId}`);
      const data = await res.json();

      if (data.success && data.data) {
        setName(data.data.name || "User");
        setEmail(data.data.email || localStorage.getItem("email") || "client@gmail.com");
        setAge(data.data.age || "22");
        setGoal(data.data.goal || "Maintain");
        setActivity(data.data.activity || "Moderate");

        localStorage.setItem("clientName", data.data.name || "User");
        localStorage.setItem("clientEmail", data.data.email || "client@gmail.com");
        localStorage.setItem("clientAge", data.data.age || "22");
        localStorage.setItem("clientGoal", data.data.goal || "Maintain");
        localStorage.setItem("clientActivity", data.data.activity || "Moderate");
      } else {
        const storedEmail = localStorage.getItem("email") || "client@gmail.com";

        setEmail(storedEmail);
        setName(localStorage.getItem("clientName") || "User");
        setAge(localStorage.getItem("clientAge") || "22");
        setGoal(localStorage.getItem("clientGoal") || "Maintain");
        setActivity(localStorage.getItem("clientActivity") || "Moderate");
      }
    } catch (error) {
      console.log("PROFILE LOAD ERROR:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadProfile();

    window.addEventListener("profileUpdated", loadProfile);

    return () => {
      window.removeEventListener("profileUpdated", loadProfile);
    };
  }, []);

  const saveProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("User not connected");
        return;
      }

      const payload = {
        userId,
        name,
        email,
        age,
        goal,
        activity,
      };

      const res = await fetch("/api/client/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Profile save failed");
        return;
      }

      localStorage.setItem("clientName", name);
      localStorage.setItem("clientEmail", email);
      localStorage.setItem("clientAge", age);
      localStorage.setItem("clientGoal", goal);
      localStorage.setItem("clientActivity", activity);

      window.dispatchEvent(new Event("profileUpdated"));
      window.dispatchEvent(new Event("metricsUpdated"));

      toast.success("Profile saved to MongoDB ?");

      setOpen(false);
    } catch (error) {
      console.log("PROFILE SAVE ERROR:", error);
      toast.error("Profile save error");
    }
  };

  const modal = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-6">

      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#111827] border border-gray-700 rounded-2xl shadow-2xl p-6">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-2xl font-bold">
              Edit Profile
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Update your personal information.
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg"
          >
            ?
          </button>

        </div>

        <div className="space-y-4">

          <div>
            <label className="text-sm text-gray-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl mt-1 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl mt-1 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Age</label>
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl mt-1 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl mt-1 outline-none focus:border-blue-500"
            >
              <option>Maintain</option>
              <option>Lose Weight</option>
              <option>Gain Muscle</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Activity Level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl mt-1 outline-none focus:border-blue-500"
            >
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>
          </div>

        </div>

        <div className="sticky bottom-0 bg-[#111827] pt-5 mt-6 flex justify-end gap-3 border-t border-gray-800">

          <button
            onClick={() => setOpen(false)}
            className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-xl transition"
          >
            Cancel
          </button>

          <button
            onClick={saveProfile}
            className="bg-green-500 hover:bg-green-400 text-black px-5 py-2 rounded-xl transition font-semibold"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );

  if (loading) {
    return (
      <div className="premium-card animate-pulse">
        <div className="h-5 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <>
      <div className="premium-card flex flex-col md:flex-row md:items-center md:justify-between gap-5">

        <div>
          <p className="section-kicker">
            Who am I?
          </p>

          <h2 className="text-2xl font-bold">
            {name}
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            {email}
          </p>

          <div className="flex gap-3 mt-4 flex-wrap">

            <span className="soft-badge">
              Age: {age}
            </span>

            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
              Goal: {goal}
            </span>

            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
              Activity: {activity}
            </span>

          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="btn-premium bg-blue-500 hover:bg-blue-400 text-white px-5 py-2 rounded-xl transition"
        >
          Edit Profile
        </button>

      </div>

      {open && mounted && createPortal(modal, document.body)}
    </>
  );
}




