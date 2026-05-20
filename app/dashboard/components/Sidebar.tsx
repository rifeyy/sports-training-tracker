"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "⊞" },
  { label: "Athletes", href: "/dashboard/athletes", icon: "👤" },
  { label: "Seances", href: "/dashboard/sessions", icon: "📅" },
  { label: "Statistiques", href: "/dashboard/stats", icon: "📊" },
  { label: "Equipes", href: "/dashboard/teams", icon: "🏅" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Deconnecte !");
    router.push("/login");
  };

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-100">
        <span className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-blue-600">⚡</span> AthleteOS
        </span>
      </div>
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
        <p className="px-3 py-1 text-xs text-gray-400 uppercase tracking-wider mb-1">Menu</p>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-2 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <span>🚪</span> Deconnexion
        </button>
      </div>
    </aside>
  );
}
