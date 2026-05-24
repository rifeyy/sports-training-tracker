"use client";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0B1220]">

      <Sidebar />

      <main className="flex-1 p-6 text-white">

        <Topbar />

        {children}

      </main>

    </div>
  );
}
