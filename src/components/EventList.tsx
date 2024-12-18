"use client";

import { useFetchEvents } from "@/hooks/useFetchEvents";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { toast } from "react-toastify";

export default function EventList({ petId }: { petId: string }) {
  const { events, loading, refetch } = useFetchEvents(petId);

  const handleDelete = async (id: string) => {
    const db = new FirestoreDatabase("events");

    try {
      await db.delete(id);
      toast.success("Evento eliminado correctamente");
      await refetch(); // Actualizar eventos tras eliminar
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
      toast.error("Error al eliminar el evento");
    }
  };

  if (loading) {
    return <p className="text-white">Cargando eventos...</p>;
  }

  if (!events.length) {
    return <p className="text-white">No hay eventos disponibles.</p>;
  }

  return (
    <div>
      {events.map((event) => (
        <div
          key={event.id}
          className="flex justify-between items-center p-4 mb-2 bg-gray-800 text-white rounded"
        >
          <div>
            <p>
              <strong>{event.title}</strong>
            </p>
            <p>Fecha Inicial: {event.date}</p>
            {event.finalDate && <p>Fecha Final: {event.finalDate}</p>}
            {event.description && <p>Descripción: {event.description}</p>}
          </div>
          <button
            onClick={() => handleDelete(event.id!)}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}
