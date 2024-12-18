"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const db = new FirestoreDatabase("events");

export default function EventForm({
  initialData,
  onSuccess,
}: {
  initialData?: { title: string; date: string; intervalDays?: number; description?: string };
  onSuccess?: () => void;
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [intervalDays, setIntervalDays] = useState<number | "">(initialData?.intervalDays || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const calculateFinalDate = () => {
    if (!date || intervalDays === "" || intervalDays === 0) return null;
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() + intervalDays);
    return startDate.toISOString().split("T")[0];
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const finalDate = calculateFinalDate();
      await db.add({
        title,
        date,
        finalDate: finalDate || null, // Fecha final puede ser null
        intervalDays: intervalDays || 0,
        description,
      });
      toast.success("Evento guardado correctamente");
      router.push("/"); // Redirige a la página principal
    } catch (error) {
      console.error("Error al guardar el evento:", error);
      toast.error("Error al guardar el evento");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-darkCard rounded">
      <h1 className="text-2xl font-bold text-accentPurple mb-4">
        {initialData ? "Editar Evento" : "Agregar Evento"}
      </h1>
      <input
        type="text"
        placeholder="Título del evento"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border rounded bg-gray-800 text-white"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 mb-4 border rounded bg-gray-800 text-white"
      />
      <input
        type="number"
        placeholder="Intervalo de días (0 si no aplica)"
        value={intervalDays}
        onChange={(e) => setIntervalDays(Number(e.target.value))}
        className="w-full p-2 mb-4 border rounded bg-gray-800 text-white"
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 mb-4 border rounded bg-gray-800 text-white"
      ></textarea>
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-accentPurple text-white p-2 rounded hover:bg-purple-700"
      >
        {saving ? "Guardando..." : "Guardar Evento"}
      </button>
    </div>
  );
}
