"use client";
import { useState } from "react";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { useEventStore } from "@/store/eventStore";
import { Event } from "@/types/event";

// Instancia de FirestoreDatabase
const db = new FirestoreDatabase("events");

export default function EventForm({
  initialData,
  onSuccess,
}: {
  initialData?: Event;
  onSuccess?: () => void;
}) {
  const { fetchEvents } = useEventStore();
  const [name, setName] = useState(initialData?.name || "");
  const [date, setDate] = useState(initialData?.date || "");

  const handleSubmit = async () => {
    try {
      if (initialData?.id) {
        await db.update(initialData.id, { name, date });
      } else {
        await db.add({ name, date });
      }
      await fetchEvents(); // Refresca los eventos
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al guardar el evento:", error);
    }
  };

  return (
    <div className="bg-darkCard p-4 rounded">
      <input
        type="text"
        placeholder="Nombre del Evento"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <button
        onClick={handleSubmit}
        className="bg-accentPurple text-white p-2 rounded w-full"
      >
        {initialData ? "Actualizar" : "Agregar"} Evento
      </button>
    </div>
  );
}
