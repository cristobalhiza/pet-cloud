"use client";

import { useEffect, useState } from "react";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { toast } from "react-toastify";

interface Event {
  id: string;
  title: string;
  date: string;
  finalDate?: string | null;
  description?: string;
}

const db = new FirestoreDatabase<Event>("events");

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await db.getAll();
      // Ordenar por fecha final más próxima
      const sortedEvents = data.sort((a, b) => {
        const dateA = new Date(a.finalDate || a.date).getTime();
        const dateB = new Date(b.finalDate || b.date).getTime();
        return dateA - dateB;
      });
      setEvents(sortedEvents);
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await db.delete(id);
      setEvents(events.filter((event) => event.id !== id));
      toast.success("Evento eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
      toast.error("Error al eliminar el evento");
    }
  };

  return (
    <div>
      {events.length > 0 ? (
        events.map((event) => (
          <div key={event.id} className="flex justify-between items-center p-4 mb-2 bg-gray-800 text-white rounded">
            <div>
              <p><strong>{event.title}</strong></p>
              <p>Fecha Inicial: {event.date}</p>
              {event.finalDate && <p>Fecha Final: {event.finalDate}</p>}
              {event.description && <p>Descripción: {event.description}</p>}
            </div>
            <button
              onClick={() => handleDelete(event.id)}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
            >
              🗑️
            </button>
          </div>
        ))
      ) : (
        <p className="text-white">No hay eventos disponibles.</p>
      )}
    </div>
  );
}