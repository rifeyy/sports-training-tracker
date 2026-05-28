"use client";

import { useEffect, useState } from "react";

export default function ProgressCard() {
  const [startWeight, setStartWeight] = useState<number>(80);
  const [currentWeight, setCurrentWeight] = useState<number>(70);
  const [goalWeight, setGoalWeight] = useState<number>(65);

  const loadProgressData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const savedStart = localStorage.getItem("clientStartWeight");
      const savedGoal = localStorage.getItem("clientGoalWeight");

      const res = await fetch(`/api/client/metrics?userId=${userId}`);
      const data = await res.json();

      if (data.success && data.data.length > 0) {
        const history = data.data;
        const first = history[0];
        const latest = history[history.length - 1];

        setStartWeight(savedStart ? Number(savedStart) : first.weight || 0);
        setCurrentWeight(latest.weight || 0);
        setGoalWeight(savedGoal ? Number(savedGoal) : 65);
      }
    } catch (error) {
      console.log("LOAD PROGRESS ERROR:", error);
    }
  };

  useEffect(() => {
    loadProgressData();

    window.addEventListener("metricsUpdated", loadProgressData);

    return () => {
      window.removeEventListener("metricsUpdated", loadProgressData);
    };
  }, []);

  const saveProgress = () => {
    localStorage.setItem("clientStartWeight", String(startWeight));
    localStorage.setItem("clientGoalWeight", String(goalWeight));

    window.dispatchEvent(new Event("metricsUpdated"));
  };

  // ✅ calculations
  const totalChangeNeeded = Math.abs(startWeight - goalWeight);
  const currentChange = Math.abs(startWeight - currentWeight);

  const progress =
    totalChangeNeeded === 0
      ? 0
      : Math.min(100, Math.max(0, (currentChange / totalChangeNeeded) * 100));

  const remaining = Math.abs(currentWeight - goalWeight);
  const isGoalReached = progress >= 100;

  return (
    <div className="premium-card">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold">Global Progress</h2>
          <p className="text-gray-400 text-sm mt-1">
            Progress calculated from MongoDB measurements.
          </p>
        </div>

        <div className="text-right">
          <p className="text-4xl font-bold text-green-400">
            {progress.toFixed(0)}%
          </p>
          <p className="text-gray-400 text-sm">Completed</p>
        </div>
      </div>

      {/* INPUTS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div>
          <label className="text-sm text-gray-400">Start Weight</label>
          <input
            type="number"
            value={startWeight}
            onChange={(e) => setStartWeight(Number(e.target.value))}
            className="w-full bg-gray-800 p-3 rounded-xl mt-1 outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Current Weight</label>
          <input
            type="number"
            value={currentWeight}
            disabled
            className="w-full bg-gray-800/60 p-3 rounded-xl mt-1 text-gray-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Goal Weight</label>
          <input
            type="number"
            value={goalWeight}
            onChange={(e) => setGoalWeight(Number(e.target.value))}
            className="w-full bg-gray-800 p-3 rounded-xl mt-1 outline-none"
          />
        </div>

      </div>

      {/* BUTTON */}
      <button
        onClick={saveProgress}
        className="bg-blue-500 hover:bg-blue-400 px-5 py-2 rounded-xl transition mb-6"
      >
        Save Progress Goal
      </button>

      {/* PROGRESS BAR */}
      <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">

        <div className="bg-gray-800 p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Start</p>
          <h3 className="text-xl font-bold">{startWeight}kg</h3>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Current</p>
          <h3 className="text-xl font-bold">{currentWeight}kg</h3>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Remaining</p>
          <h3
            className={
              isGoalReached
                ? "text-xl font-bold text-green-400"
                : "text-xl font-bold text-yellow-400"
            }
          >
            {isGoalReached ? "Goal reached ✅" : `${remaining.toFixed(1)}kg`}
          </h3>
        </div>

      </div>

    </div>
  );
}
