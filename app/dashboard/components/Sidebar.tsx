"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Clients", href: "/dashboard/clients" },
    { name: "Athletes", href: "/dashboard/athletes" },
    { name: "Seances", href: "/dashboard/sessions" },
    { name: "Statistiques", href: "/dashboard/stats" },
    { name: "Equipes", href: "/dashboard/teams" },
    { name: "Planning", href: "/dashboard/planning" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gray-950 border-r border-gray-800 p-5 text-white">

      <h1 className="text-xl font-bold mb-8">
        ⚡ AthleteOS
      </h1>

      <nav className="space-y-2">
        {menu.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "block bg-blue-500 text-white px-4 py-2 rounded-xl"
                  : "block text-gray-300 hover:bg-gray-800 px-4 py-2 rounded-xl transition"
              }
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
