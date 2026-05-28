"use client";

import { Toaster } from "react-hot-toast";
import { generateClientPDF } from "@/lib/pdf/client";

import ClientNav from "../components/dashboard/ClientNav";
import ClientSummary from "../components/dashboard/ClientSummary";
import ProfileCard from "../components/dashboard/ProfileCard";
import StatsGrid from "../components/dashboard/StatsGrid";
import ProgressCard from "../components/dashboard/ProgressCard";
import ChartsSection from "../components/dashboard/ChartsSection";
import RecommendationCards from "../components/dashboard/RecommendationCards";
import QuickActions from "../components/dashboard/QuickActions";
import HistoryTable from "../components/dashboard/HistoryTable";
import ProgressPhotos from "../components/dashboard/ProgressPhotos";

export default function ClientPage() {
  return (
    <div className="min-h-screen px-4 py-6 md:px-6 text-white bg-black">

      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto space-y-6">

        <ClientNav />
        <ClientSummary />
        <ProfileCard />
        <StatsGrid />
        <ProgressCard />
        <ChartsSection />

        {/* âœ… PDF BUTTON CLEAN */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              const weight = Number(localStorage.getItem("clientWeight")) || 0;
              const height = Number(localStorage.getItem("clientHeight")) || 0;
              const goal = localStorage.getItem("clientGoal") || "Not set";
              const activity = localStorage.getItem("clientActivity") || "Moderate";

              let bmi = 0;
              if (height > 0) {
                bmi = weight / ((height / 100) * (height / 100));
                bmi = Math.round(bmi * 10) / 10;
              }

              let calories = 2300;

              if (activity === "Low") calories = 2000;
              if (activity === "Moderate") calories = 2300;
              if (activity === "High") calories = 2600;

              if (goal === "Lose Weight") calories -= 300;
              if (goal === "Gain Muscle") calories += 300;

              (() => {
  const weight = Number(localStorage.getItem("clientWeight")) || 0;
  const height = Number(localStorage.getItem("clientHeight")) || 0;

  const goal = localStorage.getItem("clientGoal") || "Not set";
  const activity = localStorage.getItem("clientActivity") || "Moderate";

  let bmi = 0;
  if (height > 0) {
    bmi = weight / ((height / 100) * (height / 100));
    bmi = Math.round(bmi * 10) / 10;
  }

  let calories = 2300;

  if (activity === "Low") calories = 2000;
  if (activity === "Moderate") calories = 2300;
  if (activity === "High") calories = 2600;

  if (goal === "Lose Weight") calories -= 300;
  if (goal === "Gain Muscle") calories += 300;

  generateClientPDF({
    name: localStorage.getItem("clientName") || "Client",
    goal,
    activity,
    weight,
    bmi,
    calories,
    history: JSON.parse(localStorage.getItem("clientHistory") || "[]")
  });
})();
            }}
            className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-xl"
          >
            Download PDF
          </button>
        </div>

        <RecommendationCards />
        <QuickActions />
        <HistoryTable />
        <ProgressPhotos />

      </div>

    </div>
  );
}

