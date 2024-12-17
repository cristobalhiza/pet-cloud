"use client";
import { useEffect } from "react";
import { useEventStore } from "@/store/eventStore";

export default function EventList() {
  const { events, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents(); 
  }, []);

  if (events.length === 0) return <p>No hay eventos disponibles.</p>;

  return (
    <ul>
      {events.map((event) => (
        <li key={event.id} className="p-4 bg-darkCard mb-2 rounded">
          <div>
            <strong>{event.name}</strong> - {event.date}
          </div>
        </li>
      ))}
    </ul>
  );
}
