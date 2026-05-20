"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const hours = ["08:00","09:00","10:00","11:00","12:00"];

export default function PlanningPage() {

  const [sessions, setSessions] = useState<any[]>([]);

  const fetchData = async () => {
    const res = await fetch("/api/sessions");
    const data = await res.json();
    setSessions(data.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getItems = (day: string, hour: string) => {
    return sessions.filter(s => s.day === day && s.hour === hour);
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const id = result.draggableId;
    const [day, hour] = result.destination.droppableId.split("|");

    await fetch("/api/sessions/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, day, hour }),
    });

    fetchData();
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">

      <h1 className="text-3xl mb-6">📅 Planning (Hours + Drag)</h1>

      <DragDropContext onDragEnd={onDragEnd}>

        <div className="grid grid-cols-8 gap-2">

          {/* HEADER */}
          <div></div>
          {days.map(day => (
            <div key={day} className="text-center text-gray-400 text-sm">
              {day.slice(0,3)}
            </div>
          ))}

          {/* GRID */}
          {hours.map(hour => (
            <div key={hour} className="contents">

              <div className="text-xs text-gray-500">{hour}</div>

              {days.map(day => {
                const getColor = (type: string) => {
  if (type.toLowerCase() === "gym") return "bg-green-500";
  if (type.toLowerCase() === "bjj") return "bg-blue-500";
  if (type.toLowerCase() === "cardio") return "bg-red-500";
  return "bg-yellow-500";
};

const items = getItems(day, hour);

                return (
                  <Droppable key={day + hour} droppableId={`${day}|${hour}`}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="bg-gray-900 h-20 rounded p-1"
                      >

                        {items.map((it, i) => (
                          <Draggable key={it._id} draggableId={it._id} index={i}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-green-500 text-black text-xs p-1 mb-2 rounded shadow hover:scale-105 transition cursor-grab"
                              >
                                {it.type} ({it.duration}m)
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}

                      </div>
                    )}
                  </Droppable>
                );
              })}

            </div>
          ))}

        </div>

      </DragDropContext>

    </div>
  );
}
