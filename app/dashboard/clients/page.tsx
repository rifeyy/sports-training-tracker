"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { generateClientPDF } from "@/lib/pdf/client";

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/clients");
      const data = await res.json();
      setClients(data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const deleteClient = async (clientId: string, clientName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${clientName}?`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Delete failed");
        return;
      }

      toast.success("Client deleted");

      setClients((prev) =>
        prev.filter((c) => c.userId !== clientId)
      );
    } catch (err) {
      toast.error("Error deleting client");
    }
  };

  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return (
    <div className="text-white p-6">

      <h1 className="text-2xl font-bold mb-6">
        Clients
      </h1>

      <div className="grid md:grid-cols-2 gap-4">

        {clients.map((client) => {
          const name = client.profile?.name || client.email;

          return (
            <div
              key={client.userId}
              className="bg-gray-900 p-4 rounded-xl"
            >
              <h2 className="font-bold">{name}</h2>

              <p className="text-gray-400 text-sm">
                {client.email}
              </p>

              <div className="flex gap-2 mt-4">

                <Link
                  href={`/dashboard/clients/${client.userId}`}
                  className="bg-blue-500 px-3 py-1 rounded"
                >
                  View
                </Link>

                <button
                  onClick={() =>
                    deleteClient(client.userId, name)
                  }
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Delete
                </button>

                <button
                  onClick={() =>
                    generateClientPDF({
                      name,
                      goal: client.profile?.goal,
                      activity: client.profile?.activity,
                      weight: client.latestMetric?.weight,
                      bmi: client.latestMetric?.bmi,
                      calories: 2300,
                      history: client.metrics || []
                    })
                  }
                  className="bg-purple-500 px-3 py-1 rounded"
                >
                  PDF
                </button>

              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}