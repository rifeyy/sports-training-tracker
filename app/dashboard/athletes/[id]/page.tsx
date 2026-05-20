"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import type { IAthlete, ISession } from "@/lib/types";

const statusColors: Record<string, string> = {
  active: "bg-green-50 text-green-600",
  injured: "bg-red-50 text-red-500",
  resting: "bg-yellow-50 text-yellow-600",
};
const statusLabels: Record<string, string> = { active: "Actif", injured: "Blesse", resting: "Repos" };
const typeLabels: Record<string, string> = { strength: "Force", cardio: "Cardio", technical: "Technique", recovery: "Recuperation" };

export default function AthleteProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [athlete, setAthlete] = useState<IAthlete | null>(null);
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/athletes/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setAthlete(data.data.athlete);
          setSessions(data.data.sessions);
        } else { toast.error("Athlete introuvable."); router.push("/dashboard/athletes"); }
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <div className="text-center py-12 text-gray-400 text-sm">Chargement...</div>;
  if (!athlete) return null;

  const initials = athlete.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const totalDuration = sessions.reduce((acc, s) => acc + s.duration, 0);
  const avgIntensity = sessions.length ? (sessions.reduce((acc, s) => acc + s.intensity, 0) / sessions.length).toFixed(1) : "0";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/athletes" className="text-sm text-gray-400 hover:text-gray-600">← Retour</Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-xl font-bold flex items-center justify-center">{initials}</div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">{athlete.name}</h2>
          <p className="text-sm text-gray-400">{athlete.sport}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[athlete.status]}`}>
          {statusLabels[athlete.status]}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Seances totales", value: sessions.length },
          { label: "Volume total", value: `${totalDuration} min` },
          { label: "Intensite moyenne", value: `${avgIntensity}/10` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Historique des seances</h3>
        {sessions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Aucune seance enregistree.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {sessions.map((s) => (
              <div key={s._id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{s.title}</p>
                  <p className="text-xs text-gray-400">{typeLabels[s.type]} · {new Date(s.date).toLocaleDateString("fr-FR")}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{s.duration} min</p>
                  <p className="text-xs text-gray-400">Intensite {s.intensity}/10</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}