"use client";

import { useEffect, useState } from "react";

export default function RecommendationCards() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [goal, setGoal] = useState("Maintain");
  const [activity, setActivity] = useState("Moderate");

  const loadData = () => {
    const savedWeight = localStorage.getItem("clientWeight");
    const savedHeight = localStorage.getItem("clientHeight");
    const savedGoal = localStorage.getItem("clientGoal");
    const savedActivity = localStorage.getItem("clientActivity");

    if (savedWeight) setWeight(Number(savedWeight));
    if (savedHeight) setHeight(Number(savedHeight));
    if (savedGoal) setGoal(savedGoal);
    if (savedActivity) setActivity(savedActivity);
  };

  useEffect(() => {
    loadData();

    window.addEventListener("metricsUpdated", loadData);

    return () => {
      window.removeEventListener("metricsUpdated", loadData);
    };
  }, []);

  const bmi = weight / ((height / 100) * (height / 100));

  let condition = "";
  let calories = 2300;
  let dietTitle = "";
  let dietItems: string[] = [];
  let workoutTitle = "";
  let workoutItems: string[] = [];
  let focus = "";

  if (activity === "Low") calories = 2000;
  if (activity === "Moderate") calories = 2300;
  if (activity === "High") calories = 2600;

  if (goal === "Lose Weight") calories -= 300;
  if (goal === "Gain Muscle") calories += 300;

  if (bmi < 18.5) {
    condition = "Underweight";
    focus = "Muscle gain and strength development";

    dietTitle = "High-Calorie Clean Diet";
    dietItems = [
      "Increase calories progressively",
      "Eat protein in every meal",
      "Add rice, oats, eggs, milk, nuts",
      "Avoid skipping meals",
      "Drink enough water daily"
    ];

    workoutTitle = "Strength Training Plan";
    workoutItems = [
      "4 strength sessions per week",
      "Focus on compound movements",
      "Progressive overload",
      "Limit excessive cardio",
      "Sleep and recovery are essential"
    ];
  } else if (bmi < 25) {
    condition = "Normal";
    focus = "Maintain fitness and improve performance";

    dietTitle = "Balanced Nutrition";
    dietItems = [
      "Keep meals balanced",
      "Protein + carbs + healthy fats",
      "Maintain daily calories",
      "Eat vegetables and fruits",
      "Stay consistent"
    ];

    workoutTitle = "Balanced Training Plan";
    workoutItems = [
      "3 to 4 sessions per week",
      "Mix strength and cardio",
      "Add mobility work",
      "Track progress weekly",
      "Maintain recovery days"
    ];
  } else {
    condition = "Overweight";
    focus = "Fat loss and cardiovascular health";

    dietTitle = "Controlled Calories Diet";
    dietItems = [
      "Reduce calories gradually",
      "Increase protein intake",
      "Avoid sugary drinks",
      "Prioritize vegetables",
      "Keep meals simple and consistent"
    ];

    workoutTitle = "Fat Loss Training Plan";
    workoutItems = [
      "Cardio 3 to 5 times per week",
      "Strength training 2 to 3 times per week",
      "Daily walking target",
      "Avoid extreme restrictions",
      "Measure progress every week"
    ];
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <div className="premium-card">

        <p className="text-gray-400 text-sm mb-1">
          Current Focus
        </p>

        <h2 className="text-xl font-bold mb-3">
          {condition}
        </h2>

        <p className="text-gray-300 text-sm mb-4">
          {focus}
        </p>

        <div className="bg-gray-800 p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Daily Calories Target</p>
          <h3 className="text-3xl font-bold text-green-400 mt-1">
            {calories}
          </h3>
          <p className="text-xs text-gray-500">kcal / day</p>
        </div>

      </div>

      <div className="premium-card">

        <h2 className="text-xl font-bold mb-4">
          Diet Plan
        </h2>

        <p className="text-green-400 font-semibold mb-4">
          {dietTitle}
        </p>

        <ul className="space-y-3 text-sm text-gray-300">
          {dietItems.map((item, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-green-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

      </div>

      <div className="premium-card">

        <h2 className="text-xl font-bold mb-4">
          Workout Plan
        </h2>

        <p className="text-blue-400 font-semibold mb-4">
          {workoutTitle}
        </p>

        <ul className="space-y-3 text-sm text-gray-300">
          {workoutItems.map((item, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-blue-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

      </div>

    </div>
  );
}


