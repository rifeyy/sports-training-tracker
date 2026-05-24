"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function StatsGrid() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [activity, setActivity] = useState("Moderate");
  const [goal, setGoal] = useState("Maintain");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedWeight = localStorage.getItem("clientWeight");
    const savedHeight = localStorage.getItem("clientHeight");
    const savedActivity = localStorage.getItem("clientActivity");
    const savedGoal = localStorage.getItem("clientGoal");

    if (savedWeight) setWeight(Number(savedWeight));
    if (savedHeight) setHeight(Number(savedHeight));
    if (savedActivity) setActivity(savedActivity);
    if (savedGoal) setGoal(savedGoal);
  }, []);

  const bmi = weight / ((height / 100) * (height / 100));

  let condition = "";
  let bmiColor = "text-green-400";
  let recommendation = "";

  if (bmi < 18.5) {
    condition = "Underweight";
    bmiColor = "text-yellow-400";
    recommendation = "Increase calories and focus on strength training.";
  } else if (bmi < 25) {
    condition = "Normal";
    bmiColor = "text-green-400";
    recommendation = "Maintain your current routine and stay consistent.";
  } else if (bmi < 30) {
    condition = "Overweight";
    bmiColor = "text-orange-400";
    recommendation = "Reduce calories and add more cardio sessions.";
  } else {
    condition = "Obese";
    bmiColor = "text-red-400";
    recommendation = "Focus on structured fat loss with professional guidance.";
  }

  const activityCalories =
    activity === "Low" ? 2000 :
    activity === "Moderate" ? 2300 :
    2600;

  const goalAdjustment =
    goal === "Lose Weight" ? -300 :
    goal === "Gain Muscle" ? 300 :
    0;

  const calories = activityCalories + goalAdjustment;

  const saveMetrics = async () => {
    try {
      setSaving(true);

      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("User not connected");
        return;
      }

      const newRecord = {
        userId,
        weight,
        height,
        bmi: Number(bmi.toFixed(1)),
        calories,
        goal,
        activity,
        date: new Date().toLocaleDateString(),
      };

      // ✅ localStorage fallback
      localStorage.setItem("clientWeight", String(weight));
      localStorage.setItem("clientHeight", String(height));
      localStorage.setItem("clientActivity", activity);
      localStorage.setItem("clientGoal", goal);

      const oldHistory = JSON.parse(localStorage.getItem("clientMetricsHistory") || "[]");
      const newHistory = [...oldHistory, newRecord];
      localStorage.setItem("clientMetricsHistory", JSON.stringify(newHistory));

      // ✅ MongoDB save
      const res = await fetch("/api/client/metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecord),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to save to database");
        return;
      }

      window.dispatchEvent(new Event("metricsUpdated"));

      toast.success("Metrics saved to MongoDB ✅");
    } catch (error) {
      console.log(error);
      toast.error("Save metrics error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">

      <div className="premium-card">

        <h2 className="text-xl font-bold mb-4">
          Health Metrics
        </h2>

        <div className="responsive-grid-4">

          <div>
            <label className="text-sm text-gray-400">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="responsive-input bg-gray-800 p-3 rounded-xl mt-1 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="responsive-input bg-gray-800 p-3 rounded-xl mt-1 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="responsive-input bg-gray-800 p-3 rounded-xl mt-1 outline-none"
            >
              <option>Maintain</option>
              <option>Lose Weight</option>
              <option>Gain Muscle</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Activity</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="responsive-input bg-gray-800 p-3 rounded-xl mt-1 outline-none"
            >
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>
          </div>

        </div>

        <button
          onClick={saveMetrics}
          disabled={saving}
          className="mt-5 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black px-5 py-2 rounded-xl transition font-semibold"
        >
          {saving ? "Saving..." : "Save Metrics"}
        </button>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

        <div className="premium-card hover:-translate-y-1 transition">
          <p className="text-gray-400 text-sm">Weight</p>
          <h3 className="text-2xl font-bold mt-2">{weight}kg</h3>
        </div>

        <div className="premium-card hover:-translate-y-1 transition">
          <p className="text-gray-400 text-sm">Height</p>
          <h3 className="text-2xl font-bold mt-2">{height}cm</h3>
        </div>

        <div className="premium-card hover:-translate-y-1 transition">
          <p className="text-gray-400 text-sm">BMI</p>
          <h3 className={`text-2xl font-bold mt-2 ${bmiColor}`}>
            {bmi.toFixed(1)}
          </h3>
        </div>

        <div className="premium-card hover:-translate-y-1 transition">
          <p className="text-gray-400 text-sm">Condition</p>
          <h3 className={`text-lg font-semibold mt-2 ${bmiColor}`}>
            {condition}
          </h3>
        </div>

        <div className="premium-card hover:-translate-y-1 transition">
          <p className="text-gray-400 text-sm">Calories</p>
          <h3 className="text-2xl font-bold mt-2">
            {calories}
          </h3>
          <p className="text-xs text-gray-500">kcal/day</p>
        </div>

        <div className="premium-card hover:-translate-y-1 transition">
          <p className="text-gray-400 text-sm">Goal</p>
          <h3 className="text-lg font-semibold mt-2 text-blue-400">
            {goal}
          </h3>
        </div>

      </div>

      <div className="premium-card">

        <p className="text-gray-400 text-sm mb-1">
          Smart Recommendation
        </p>

        <h3 className={`text-lg font-semibold ${bmiColor}`}>
          {condition}
        </h3>

        <p className="text-gray-300 mt-2">
          {recommendation}
        </p>

      </div>

    </div>
  );
}
