"use client";

import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { toast } from "react-toastify";
import { Event } from "@/types/event";
import { useFetchEvents } from "@/hooks/useFetchEvents";

const db = new FirestoreDatabase<Event>("events");

export default function EventList() {
  const { events, loading, refetch } = useFetchEvents(); // Añadimos una función refetch para recargar eventos

  const handleDelete = async (id: string) => {
    try {
      await db.delete(id); // Eliminar el evento de la base de datos
      toast.success("Evento eliminado correctamente");
      refetch(); // Actualizar el estado local llamando nuevamente al hook
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
      toast.error("Error al eliminar el evento");
    }
  };

  if (loading) {
    return <p className="text-white">Cargando eventos...</p>;
  }

  // Ordenar eventos por fecha final más próxima
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.finalDate || a.date).getTime();
    const dateB = new Date(b.finalDate || b.date).getTime();
    return dateA - dateB;
  });

  return (
    <div>
      {sortedEvents.length > 0 ? (
        sortedEvents.map((event) => (
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
              type="button"
              onClick={() => {
                if (event.id) handleDelete(event.id);
              }}
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
