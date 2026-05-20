"use client";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/dashboard/athletes": "Athletes",
  "/dashboard/sessions": "Seances",
  "/dashboard/stats": "Statistiques",
  "/dashboard/teams": "Equipes",
};

export default function Topbar({ userName }: { userName?: string }) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "AthleteOS";
  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "CO";

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      <h1 className="text-base font-medium text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition">
          <span>+</span> Nouvelle seance
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold flex items-center justify-center">
          {initials}
        </div>
      </div>
    </header>
  );
}
