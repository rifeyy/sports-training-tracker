"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function PlanningPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlanning = async () => {
    try {
      setLoading(true);

      const sessionsRes = await fetch("/api/sessions");
      const sessionsData = await sessionsRes.json();

      const athletesRes = await fetch("/api/athletes");
      const athletesData = await athletesRes.json();

      setSessions(sessionsData.success ? sessionsData.data || [] : []);
      setAthletes(athletesData.success ? athletesData.data || [] : []);
    } catch (error) {
      console.log("LOAD PLANNING ERROR:", error);
      toast.error("Failed to load planning");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlanning();
  }, []);

  const getAthleteName = (id: string) => {
    const athlete = athletes.find((item) => item._id === id);
    return athlete?.name || "Unknown";
  };

  const groupedSessions = useMemo(() => {
    const groups: Record<string, any[]> = {};

    days.forEach((day) => {
      groups[day] = [];
    });

    sessions.forEach((session) => {
      const sessionDay = session.day || "Monday";

      if (!groups[sessionDay]) {
        groups[sessionDay] = [];
      }

      groups[sessionDay].push(session);
    });

    return groups;
  }, [sessions]);

  const updateSessionDay = async (session: any, newDay: string) => {
    try {
      const res = await fetch(`/api/sessions/${session._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          athleteId: session.athleteId,
          type: session.type,
          duration: session.duration,
          day: newDay,
          hour: session.hour || "",
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to update planning");
        loadPlanning();
        return;
      }

      toast.success("Session moved successfully");
    } catch (error) {
      console.log("UPDATE SESSION DAY ERROR:", error);
      toast.error("Move session error");
      loadPlanning();
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const sourceDay = source.droppableId;
    const destinationDay = destination.droppableId;

    const movedSession = sessions.find((session) => session._id === draggableId);

    if (!movedSession) return;

    if (sourceDay === destinationDay) {
      const daySessions = groupedSessions[sourceDay] || [];
      const reordered = Array.from(daySessions);

      const [removed] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, removed);

      const otherSessions = sessions.filter(
        (session) => (session.day || "Monday") !== sourceDay
      );

      setSessions([...otherSessions, ...reordered]);
      return;
    }

    const updatedSessions = sessions.map((session) => {
      if (session._id === draggableId) {
        return {
          ...session,
          day: destinationDay,
        };
      }

      return session;
    });

    setSessions(updatedSessions);

    await updateSessionDay(movedSession, destinationDay);
  };

  if (loading) {
    return (
      <div className="text-white">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl animate-pulse">
          Loading planning...
        </div>
      </div>
    );
  }

  return (
    <div className="text-white space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-gray-400 text-sm">Admin area</p>
          <h1 className="text-3xl font-bold">Planning</h1>
          <p className="text-gray-400 mt-1">
            Drag sessions between days. Changes are saved to MongoDB.
          </p>
        </div>

        <button
          onClick={loadPlanning}
          className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-xl transition"
        >
          Refresh
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center text-gray-400">
          No sessions yet. Add sessions from the Sessions page.
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {days.map((day) => (
              <Droppable droppableId={day} key={day}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={
                      snapshot.isDraggingOver
                        ? "bg-gray-900 border border-blue-500 rounded-2xl p-5 min-h-[220px] transition"
                        : "bg-gray-900 border border-gray-800 rounded-2xl p-5 min-h-[220px] transition"
                    }
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">{day}</h2>

                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                        {groupedSessions[day]?.length || 0} sessions
                      </span>
                    </div>

                    {groupedSessions[day]?.length === 0 ? (
                      <div className="border border-dashed border-gray-700 rounded-xl p-6 text-center text-gray-500">
                        Drop sessions here
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {groupedSessions[day].map((session, index) => (
                          <Draggable
                            key={session._id}
                            draggableId={session._id}
                            index={index}
                          >
                            {(dragProvided, dragSnapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                className={
                                  dragSnapshot.isDragging
                                    ? "bg-gray-700 border border-green-400 p-4 rounded-xl shadow-2xl cursor-grabbing"
                                    : "bg-gray-800 border border-gray-700 p-4 rounded-xl hover:border-green-500/40 transition cursor-grab"
                                }
                              >
                                <h3 className="font-semibold">
                                  {getAthleteName(session.athleteId)}
                                </h3>

                                <p className="text-gray-400 text-sm mt-1">
                                  {session.type} - {session.duration} min
                                </p>

                                {session.hour && (
                                  <p className="text-gray-500 text-xs mt-1">
                                    Hour: {session.hour}
                                  </p>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    )}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}