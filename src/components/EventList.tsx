"use client";

import { useState } from "react";
import { Event } from "@/types/event";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { toast } from "react-toastify";
import { CalendarIcon, TrashIcon } from '@primer/octicons-react';

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

interface EventListProps {
  events: Event[];
  onDelete: () => Promise<void>;
}

export default function EventList({ events, onDelete }: EventListProps) {
  const [sortBy, setSortBy] = useState<"date" | "finalDate" | "name">("date");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

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

  const sortedEvents = [...events].sort((a, b) => {
    const getTimeOrMax = (date: string | undefined): number =>
      date ? new Date(date).getTime() : Number.MAX_SAFE_INTEGER;

    const getTimeOrMin = (date: string | undefined): number =>
      date ? new Date(date).getTime() : Number.MIN_SAFE_INTEGER;

    if (sortBy === "date") {
      return order === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === "finalDate") {
      return order === "asc"
        ? getTimeOrMax(a.finalDate) - getTimeOrMax(b.finalDate)
        : getTimeOrMin(b.finalDate) - getTimeOrMin(a.finalDate);
    }
    if (sortBy === "name") {
      return order === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    return 0;
  });

  

  return (
    <div>
      {/* Filtros */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex flex-row sm:text-lg">
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

        <div className="flex flex-row sm:text-lg">
          <label className="text-dark mr-2">Orden:</label>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
            className="p-2 rounded bg-dark text-white border border-mediumGray "
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
            className="flex justify-between items-center p-4 mb-2 bg-beige text-dark rounded sm:text-lg"
          >
            <div>
              <p>
                <strong>{event.title}</strong>
              </p>
              <p>Fecha Inicial: {formatDate(event.date)}</p>
              {event.finalDate && <p>Fecha Final: {formatDate(event.finalDate)}</p>}
              {event.description && <p>Descripción: {event.description}</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(event.id!)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
              >
                <TrashIcon size={24} />
              </button>
              <button
                onClick={() => handleSyncToGoogleCalendar(event)}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
              >
                <CalendarIcon size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
