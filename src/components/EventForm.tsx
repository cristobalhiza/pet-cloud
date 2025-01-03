"use client";

import { useState } from "react";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { Event } from "@/types/event";
import { toast } from "react-toastify";
import { createGoogleCalendarEventDto } from "@/dto/googleCalendarEventDto";
import { useFetchEvents } from "@/hooks/useFetchEvents";

const db = new FirestoreDatabase<Event>("events");

export default function EventForm({
  initialData,
  petId,
  onSuccess,
}: {
  initialData: Partial<Event> | null;
  petId: string;
  onSuccess: () => Promise<void>;
}) {
  const [eventData, setEventData] = useState<Partial<Event>>(initialData || {});
  const [saving, setSaving] = useState(false);
  const { events, loading, refetch } = useFetchEvents(petId);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: name === "daysInterval" ? parseInt(value) || 0 : value,
    }));
  };

  const calculateFinalDate = (date: string, daysInterval?: number): string | undefined => {
    if (!date || !daysInterval) return undefined;
    const initialDate = new Date(date);
    initialDate.setDate(initialDate.getDate() + daysInterval);
    return initialDate.toISOString();
  };

  const handleSave = async () => {
    if (!petId) {
      toast.error("No se puede guardar el evento sin una mascota seleccionada.");
      return;
    }
  
    const { title, date, description, daysInterval } = eventData;
    if (!title || !date) {
      toast.error("Los campos 'Título' y 'Fecha' son obligatorios.");
      return;
    }
  
    setSaving(true);
    try {
      const finalDate = calculateFinalDate(date, daysInterval);
  
      const eventToAdd: Omit<Event, "id"> = {
        petId,
        title,
        date,
        description: description || "",
        daysInterval: daysInterval || 0,
        finalDate: finalDate || "",
      };
  
      // Guardar en Firebase
      await db.add(eventToAdd);
      await refetch();
      // Si no hay `finalDate`, no sincronizamos con Google Calendar
      if (!finalDate) {
        toast.info("Evento guardado localmente. No se requiere sincronización con Google Calendar.");
        await onSuccess(); // Refresca la interfaz
        return;
      }
  
      // Obtener el token de acceso
      const tokenResponse = await fetch("/api/google/get-token");
      if (!tokenResponse.ok) {
        const error = await tokenResponse.json();
        console.error("Error fetching access token:", error);
        throw new Error(error.error || "Failed to retrieve access token");
      }
  
      const { access_token: accessToken } = await tokenResponse.json();
      console.log("Access Token fetched:", accessToken);
  
      // Crear DTO para Google Calendar
      const startDate = new Date(date);
      const endDate = new Date(finalDate);
  
      const isAllDayEvent = true;
      const calendarEvent = createGoogleCalendarEventDto(
        title,
        description,
        startDate,
        endDate,
        isAllDayEvent
      );
  
      // Enviar a la API de Google Calendar
      const calendarResponse = await fetch("/api/google/add-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken,
          title,
          date,
          daysInterval,
          description,
        }),
      });
  
      if (!calendarResponse.ok) {
        const error = await calendarResponse.json();
        console.error("Google Calendar API Error:", error);
        toast.error(`Error al sincronizar con Google Calendar: ${error.error.message}`);
        return;
      } else {
        const createdEvent = await calendarResponse.json();
        await refetch();
        window.open(createdEvent.htmlLink, "_blank");
        toast.success("Evento sincronizado con Google Calendar.");
      }
      
      await onSuccess();
    } catch (error) {
      console.error("Unexpected error while saving event:", error);
      toast.error("Error inesperado al guardar el evento.");
    } finally {
      setSaving(false);
    }
  };
  

  return (
    <div className="space-y-4 text-dark">
      <input
        type="text"
        name="title"
        placeholder="Título del Evento"
        value={eventData.title || ""}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg bg-lightGray placeholder-dark"
      />
      <input
        type="date"
        name="date"
        value={eventData.date || ""}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg bg-lightGray placeholder-dark"
      />
      <input
        type="number"
        name="daysInterval"
        placeholder="Días de Duración"
        value={eventData.daysInterval || ""}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg bg-lightGray placeholder-dark"
      />
      <textarea
        name="description"
        placeholder="Descripción"
        value={eventData.description || ""}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg bg-lightGray placeholder-dark resize-none"
        rows={4}
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full p-3 rounded-lg text-dark font-semibold transition ${
          saving
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-accentPurple hover:bg-lightGray"
        }`}
      >
        {saving ? "Guardando..." : "Guardar Evento"}
      </button>
    </div>
  );
}
