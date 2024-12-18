"use client";

import { useState } from "react";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { Event } from "@/types/event";
import { toast } from "react-toastify";

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
    return initialDate.toISOString().split("T")[0]; // Retorna en formato "YYYY-MM-DD"
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

      await db.add(eventToAdd);
      toast.success("Evento guardado correctamente.");
      await onSuccess();
    } catch (error) {
      console.error("Error al guardar el evento:", error);
      toast.error("Error al guardar el evento.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        name="title"
        placeholder="Título del Evento"
        value={eventData.title || ""}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400"
      />
      <input
        type="date"
        name="date"
        value={eventData.date || ""}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400"
      />
      <input
        type="number"
        name="daysInterval"
        placeholder="Días de Duración"
        value={eventData.daysInterval || ""}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400"
      />
      <textarea
        name="description"
        placeholder="Descripción"
        value={eventData.description || ""}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 resize-none"
        rows={4}
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full p-3 rounded-lg text-white font-semibold transition ${
          saving
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-accentPurple hover:bg-purple-700"
        }`}
      >
        {saving ? "Guardando..." : "Guardar Evento"}
      </button>
    </div>
  );
}
