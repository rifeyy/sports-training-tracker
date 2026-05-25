"use client";

import { Toaster } from "react-hot-toast";

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
    <div className="min-h-screen px-4 py-6 md:px-6 lg:px-8 text-white bg-gradient-to-br from-[#070b14] via-[#0B1220] to-[#111827]">

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111827",
            color: "#fff",
            border: "1px solid #374151",
          },
        }}
      />

      <div className="max-w-7xl mx-auto space-y-6">

        <div className="fade-up">
          <ClientNav />
        </div>

        <div className="fade-up">
          <ClientSummary />
        </div>

        <div className="fade-up">
          <ProfileCard />
        </div>

        <div className="fade-up">
          <StatsGrid />
        </div>

        <div className="fade-up">
          <ProgressCard />
        </div>

        <div className="fade-up">
          <ChartsSection />
        </div>

        <div className="fade-up">
          <RecommendationCards />
        </div>

        <div className="fade-up">
          <QuickActions />
        </div>

        <div className="fade-up">
          <HistoryTable />
        </div>

        <div className="fade-up">
          <ProgressPhotos />
        </div>

      </div>

    </div>
  );
}




