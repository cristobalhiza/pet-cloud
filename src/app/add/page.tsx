"use client";

import EventForm from "@/components/EventForm";

export default function AddEventPage() {
  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-accentPurple mb-6">
        Agregar Nuevo Evento
      </h1>
      <EventForm />
    </div>
  );
}
