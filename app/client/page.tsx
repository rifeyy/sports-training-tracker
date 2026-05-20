"use client";

import ProfileCard from "../components/dashboard/ProfileCard";
import StatsGrid from "../components/dashboard/StatsGrid";
import ChartsSection from "../components/dashboard/ChartsSection";
import ProgressCard from "../components/dashboard/ProgressCard";
import HistoryTable from "../components/dashboard/HistoryTable";

export default function ClientPage() {

  return (
    <div className="bg-[#0B1220] min-h-screen p-6 text-white">

      <div className="max-w-6xl mx-auto space-y-6">

        <ProfileCard />

        <StatsGrid />

        <ProgressCard />

        <ChartsSection />

        <HistoryTable />

      </div>

    </div>
  );
}

