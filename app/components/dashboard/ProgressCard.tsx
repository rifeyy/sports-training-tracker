"use client";

import { useEffect, useState } from "react";

export default function ProgressCard() {

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("history");

    if (saved) {
      const weights = JSON.parse(saved);

      const start = weights[0];
      const current = weights[weights.length - 1];
      const goal = current - 5;

      const p = ((start - current) / (start - goal)) * 100;
      setProgress(Math.min(100, Math.max(0, p)));
    }
  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-xl text-center">

      <h2 className="mb-4">🎯 Global Progress</h2>

      <div className="text-3xl text-green-400 font-bold">
        {progress.toFixed(0)}%
      </div>

      <div className="bg-gray-800 h-3 rounded mt-4">

        <div
          className="bg-green-500 h-3 rounded"
          style={{ width: `${progress}%` }}
        />

      </div>

    </div>
  );
}
