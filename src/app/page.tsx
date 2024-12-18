"use client";

import { useEffect, useState } from "react";
import EventList from "@/components/EventList";
import ProfileCard from "@/components/ProfileCard";
import Link from "next/link";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Pet {
  name: string;
}

const db = new FirestoreDatabase<Pet>("pet");

export default function Home() {
  const [profileName, setProfileName] = useState<string>("");

  useEffect(() => {
    const fetchProfileName = async () => {
      try {
        const data = await db.getOne("profile");
        if (data?.name) setProfileName(data.name);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };

    fetchProfileName();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <ToastContainer />
      <h1 className="text-4xl font-bold text-accentPurple mb-6">
        Rincón de {profileName || "la mascota"} 🐾
      </h1>

      <div className="bg-darkCard p-4 rounded mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Perfil de la Perrita</h2>
        <ProfileCard />
      </div>

      <div className="bg-darkCard p-4 rounded">
        <h2 className="text-2xl font-bold text-white mb-4">Calendario de Eventos</h2>
        <EventList />
        <Link href="/add">
          <button className="mt-4 bg-accentPurple text-white p-2 rounded">
            + Agregar Evento
          </button>
        </Link>
      </div>
    </div>
  );
}