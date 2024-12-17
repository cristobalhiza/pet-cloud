"use client";
import EventList from "@/components/EventList";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-4xl font-bold text-accentPurple mb-4">
        Rincón de la Kaisita 🐾
      </h1>
      <div className="flex justify-end mb-4">
        <Link href="/add">
          <button className="bg-accentPurple text-white p-2 rounded hover:bg-purple-700 transition">
            + Agregar Evento
          </button>
        </Link>
      </div>
      <EventList />
    </div>
  );
}
