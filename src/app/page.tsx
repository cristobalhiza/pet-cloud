"use client";
import { useEffect, useState } from "react";
import EventList from "@/components/EventList";
import ProfileCard from "@/components/ProfileCard";
import Link from "next/link";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
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
    <>
      <div className="p-6 min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-accentPurple mb-8">
          Rincón de {profileName || "la mascota"} 🐾
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Perfil de la Perrita */}
          <div className="bg-darkCard p-6 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-white text-center">
              INFORMACIÓN
            </h2>
            <ProfileCard />
          </div>

          {/* Calendario de Eventos */}
          <div className="bg-darkCard p-6 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">
              VACUNAS Y EVENTOS IMPORTANTES
            </h2>
            <EventList />
            <Link href="/add">
              <button className="mt-4 bg-accentPurple text-white p-2 rounded hover:bg-purple-700 w-full">
                + Agregar Evento
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
