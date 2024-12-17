"use client";
import { useState } from "react";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { useRouter } from "next/navigation";
import { useEventStore } from "../../store/eventStore";

// Instancia de FirestoreDatabase
const db = new FirestoreDatabase("events");

export default function AddEventPage() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addEvent = async () => {
    if (!name || !date) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    setLoading(true);
    try {
      await db.add({ name, date });
      await useEventStore.getState().fetchEvents();
      alert("Evento agregado correctamente.");
      router.push("/"); // Redirige a la página principal
    } catch (error) {
      console.error("Error al agregar el evento:", error);
      alert("Hubo un error al agregar el evento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-accentPurple mb-4">
        Agregar Nuevo Evento
      </h1>
      <div className="bg-darkCard p-6 rounded shadow-md">
        <input
          type="text"
          placeholder="Nombre del Evento"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded text-darkBackground"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 mb-4 border rounded text-darkBackground"
        />
        <button
          onClick={addEvent}
          disabled={loading}
          className={`w-full p-2 text-white rounded ${
            loading ? "bg-gray-500" : "bg-accentPurple hover:bg-purple-700"
          }`}
        >
          {loading ? "Guardando..." : "Guardar Evento"}
        </button>
      </div>
    </div>
  );
}
