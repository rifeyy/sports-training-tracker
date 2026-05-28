"use client";

import { useEffect, useState } from "react";

export default function ProgressCard() {
  const [startWeight, setStartWeight] = useState(80);
  const [currentWeight, setCurrentWeight] = useState(70);
  const [goalWeight, setGoalWeight] = useState(65);

  const loadProgressData = async () => {
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

      setStartWeight(savedStart ? Number(savedStart) : first.weight);
      setCurrentWeight(latest.weight);
      setGoalWeight(savedGoal ? Number(savedGoal) : 65);
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

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h2 className="text-xl font-bold">
            Global Progress
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Progress calculated from your real MongoDB measurements.
          </p>
        </div>

        <div className="text-right">
          <p className="text-4xl font-bold text-green-400">
            {progress.toFixed(0)}%
          </p>

          <p className="text-gray-400 text-sm">
            Completed
          </p>
        </div>

      </div>

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
            className="w-full bg-gray-800/60 p-3 rounded-xl mt-1 outline-none text-gray-400"
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

      <button
        onClick={saveProgress}
        className="bg-blue-500 hover:bg-blue-400 px-5 py-2 rounded-xl transition mb-6"
      >
        Save Progress Goal
      </button>

      <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden">

        <div
          className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />

      </div>

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

          <h3 className={isGoalReached ? "text-xl font-bold text-green-400" : "text-xl font-bold text-yellow-400"}>
            {isGoalReached ? "Goal reached ?" : `${remaining.toFixed(1)}kg`}
          </h3>
        </div>

      </div>

    </div>
  );

  // ✅ ===== BMI + CALORIES FIX =====
  const weightValue = Number(weight) || 0;
  const heightValue = Number(height) || 0;

  const goalValue = goal || "Not set";
  const activityValue = activity || "Moderate";

  let bmiValue = 0;
  if (heightValue > 0) {
    bmiValue = weightValue / ((heightValue / 100) * (heightValue / 100));
    bmiValue = Math.round(bmiValue * 10) / 10;
  }

  let caloriesValue = 2300;

  if (activityValue === "Low") caloriesValue = 2000;
  if (activityValue === "Moderate") caloriesValue = 2300;
  if (activityValue === "High") caloriesValue = 2600;

  if (goalValue === "Lose Weight") caloriesValue -= 300;
  if (goalValue === "Gain Muscle") caloriesValue += 300;

  localStorage.setItem("clientWeight", String(weightValue));
  localStorage.setItem("clientHeight", String(heightValue));
  localStorage.setItem("clientBMI", String(bmiValue));
  localStorage.setItem("clientCalories", String(caloriesValue));
  localStorage.setItem("clientGoal", goalValue);
  localStorage.setItem("clientActivity", activityValue);

  const history = JSON.parse(localStorage.getItem("clientHistory") || "[]");

  history.push({
    weight: weightValue,
    bmi: bmiValue,
    date: new Date().toLocaleDateString(),
  });

  localStorage.setItem("clientHistory", JSON.stringify(history));
  // ✅ =============================
}
