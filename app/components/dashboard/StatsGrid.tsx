useEffect(() => {
  const saved = localStorage.getItem("history");
  if (saved) setHistory(JSON.parse(saved));
}, []);
useEffect(() => {
  const saved = localStorage.getItem("history");
  if (saved) setHistory(JSON.parse(saved));
}, []);
useEffect(() => {
  const saved = localStorage.getItem("history");
  if (saved) setHistory(JSON.parse(saved));
}, []);
"use client";

import { useState } from "react";

export default function StatsGrid() {

  const [weight, setWeight] = useState(70);
const [history, setHistory] = useState<number[]>([]);
const [history, setHistory] = useState<number[]>([]);
const [history, setHistory] = useState<number[]>([]);
  const [height, setHeight] = useState(170);

  const bmi = weight / ((height / 100) * (height / 100));

  let condition = "";
  let advice = "";
  let color = "text-green-400";

  if (bmi < 18.5) {
    condition = "Underweight";
    advice = "You need to gain muscle 💪 (increase calories + strength training)";
    color = "text-yellow-400";
  } else if (bmi < 25) {
    condition = "Normal";
    advice = "Great! Maintain your fitness ✅";
    color = "text-green-400";
  } else if (bmi < 30) {
    condition = "Overweight";
    advice = "Reduce fat 🔥 (cardio + calorie deficit)";
    color = "text-orange-400";
  } else {
    condition = "Obese";
    advice = "Urgent: lose weight ⚠️ (strict diet + daily cardio)";
    color = "text-red-400";
  }

  return (
    <div className="space-y-6">

      {/* ✅ INPUT */}
      <div className="flex gap-4">

        <input
          type="number"
          value={weight}
          onChange={(e)=>{
  const val = +e.target.value;
  setWeight(val);

  const newHist = [...history, val];
  setHistory(newHist);

  localStorage.setItem("history", JSON.stringify(newHist));
}}
          className="bg-gray-800 p-2 rounded w-32"
          placeholder="Weight"
        />

        <input
          type="number"
          value={height}
          onChange={(e)=>setHeight(+e.target.value)}
          className="bg-gray-800 p-2 rounded w-32"
          placeholder="Height"
        />

      </div>

      {/* ✅ CARDS */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-gray-900 p-4 rounded">
          <p className="text-gray-400">Weight</p>
          <h2 className="text-xl">{weight} kg</h2>
        </div>

        <div className="bg-gray-900 p-4 rounded">
          <p className="text-gray-400">Height</p>
          <h2 className="text-xl">{height} cm</h2>
        </div>

        <div className="bg-gray-900 p-4 rounded">
          <p className="text-gray-400">BMI</p>
          <h2 className={"text-xl " + color}>
            {bmi.toFixed(1)}
          </h2>
        </div>

      </div>

      {/* ✅ AI Recommendation */}
      <div className="bg-gray-900 p-4 rounded">

        <p className="text-gray-400 mb-1">Condition</p>
        <p className={color}>{condition}</p>

        <p className="mt-2 text-sm text-gray-300">
          🤖 {advice}
        </p>

      </div>

    </div>
  );
}


