"use client";

import { useState } from "react";
import { Event } from "@/types/event";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { toast } from "react-toastify";
import { CalendarIcon, TrashIcon, PencilIcon } from '@primer/octicons-react';
import EventForm from './EventForm';


const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

interface EventListProps {
  events: Event[];
  onDelete: () => Promise<void>;
}

export default function EventList({ events, onDelete }: EventListProps) {
  const [sortBy, setSortBy] = useState<"date" | "finalDate" | "name">("finalDate");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const db = new FirestoreDatabase<Event>("events");

    try {
      await db.delete(id);
      toast.success("Evento eliminado correctamente");
      await onDelete();
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
      toast.error("Error al eliminar el evento");
    }
  };

  if (!events.length) {
    return <p className="text-dark text-2xl">No hay eventos disponibles.</p>;
  }

  const handleSyncToGoogleCalendar = async (event: Event) => {
    try {
      const tokenResponse = await fetch("/api/google/get-token");
      if (!tokenResponse.ok) {
        const error = await tokenResponse.json();
        throw new Error(error.error || "Failed to retrieve access token");
      }

      const { access_token: accessToken } = await tokenResponse.json();

      const response = await fetch("/api/google/add-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken,
          title: event.title,
          date: event.date,
          daysInterval: event.daysInterval,
          description: event.description,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error al sincronizar con Google Calendar:", error);
        toast.error(`Error al sincronizar con Google Calendar: ${error.error.message}`);
        return;
      }

      const createdEvent = await response.json();
      window.open(createdEvent.htmlLink, "_blank");
      toast.success("Evento sincronizado con Google Calendar.");
    } catch (error) {
      console.error("Error al sincronizar el evento:", error);
      toast.error("Error al sincronizar el evento con Google Calendar.");
    }
  };

  if (!events.length) {
    return <p className="text-dark text-2xl">No hay eventos disponibles.</p>;
  }

  const sortedEvents = (() => {
    const today = new Date().getTime();
  
    const getTimeOrMax = (date: string | undefined): number =>
      date ? new Date(date).getTime() : Number.MAX_SAFE_INTEGER;
  
    if (sortBy === "date") {
      return [...events].sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return order === "asc" ? timeA - timeB : timeB - timeA;
      });
    }
  
    if (sortBy === "finalDate") {
      const eventsWithFutureFinalDate = events.filter(
        (event) => new Date(event.finalDate || event.date).getTime() >= today
      );
  
      const eventsWithPastFinalDate = events.filter(
        (event) => new Date(event.finalDate || event.date).getTime() < today
      );
  
      eventsWithFutureFinalDate.sort((a, b) => {
        const timeA = getTimeOrMax(a.finalDate);
        const timeB = getTimeOrMax(b.finalDate);
        return order === "asc" ? timeA - timeB : timeB - timeA;
      });
  
      eventsWithPastFinalDate.sort((a, b) => {
        const timeA = getTimeOrMax(a.finalDate);
        const timeB = getTimeOrMax(b.finalDate);
        return order === "asc" ? timeA - timeB : timeB - timeA;
      });
  
      return [...eventsWithFutureFinalDate, ...eventsWithPastFinalDate];
    }
  
    if (sortBy === "name") {
      return [...events].sort((a, b) =>
        order === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      );
    }
  
    return events;
  })();
  
  

  

  return (
    <div>
      {/* Filtros */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex flex-row sm:text-base">
          <label className="text-dark mr-2">Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "date" | "finalDate" | "name")
            }
            className="p-2 rounded bg-dark text-white border border-mediumGray"
          >
            <option value="date">Fecha Inicial</option>
            <option value="finalDate">Fecha Final</option>
            <option value="name">Nombre</option>
          </select>
        </div>

        <div className="flex flex-row sm:text-base">
          <label className="text-dark mr-2">Orden:</label>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
            className="p-2 rounded bg-dark text-white border border-mediumGray"
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>

      {/* Lista de eventos */}
      <div className="h-[558px] overflow-y-scroll bg-mediumGray p-4 rounded-lg">
        {sortedEvents.map((event) => (
          <div
            key={event.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 mb-2 bg-beige text-dark rounded sm:text-base"
          >
            <div className="mb-4 sm:mb-0">
              <p>
                <strong>{event.title}</strong>
              </p>
              <p>Fecha Inicial: {formatDate(event.date)}</p>
              {event.finalDate && <p>Fecha Final: {formatDate(event.finalDate)}</p>}
              {event.description && <p>Descripción: {event.description}</p>}
            </div>
            <div className="flex gap-4 justify-center items-center">
              <button
                onClick={() => handleSyncToGoogleCalendar(event)}
                title="Agregar a Google Calendar"
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
              >
                <CalendarIcon size={18} />
              </button>
              <button
                onClick={() => handleEdit(event)}
                title="Editar"
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-700"
              >
                <PencilIcon size={18} />
              </button>
              <button
                onClick={() => handleDelete(event.id!)}
                title="Eliminar"
                className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
              >
                <TrashIcon size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      {showForm && editingEvent && (
        <div className="fixed inset-0 bg-dark bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark p-4 sm:p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-black font-bold bg-orange p-2 rounded-full hover:bg-beige"
            >
              ✕
            </button>
            <h2 className="text-base sm:text-xl font-bold text-orange text-center mb-4">
              Editar Evento
            </h2>
            <EventForm
              initialData={editingEvent}
              petId={editingEvent.petId!}
              onSuccess={async () => {
                await onDelete(); // Refetch de eventos
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
