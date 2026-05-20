"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Athletes", href: "/dashboard/athletes" },
    { name: "Seances", href: "/dashboard/sessions" },
    { name: "Statistiques", href: "/dashboard/stats" },
    { name: "Equipes", href: "/dashboard/teams" },
    { name: "Planning", href: "/dashboard/planning" },
  ];

  return (
    <div className="flex min-h-screen">

      {/* ✅ SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white p-6">

        <h1 className="text-xl font-bold mb-6">⚡ AthleteOS</h1>

        <div className="flex flex-col gap-3">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded ${
                pathname === item.href ? "bg-green-600" : "hover:bg-gray-800"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

      </div>

      {/* ✅ MAIN */}
      <div className="flex-1 bg-black text-white p-6">

        {/* ✅ TOAST */}
        <Toaster />

        {children}

      </div>

    </div>
  );
}
