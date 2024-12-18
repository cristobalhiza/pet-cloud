"use client";

import EventForm from "@/components/EventForm";
import { useFetchEvents } from "@/hooks/useFetchEvents";
import { usePetContext } from "@/context/PetContext";
import { useRouter } from "next/navigation"; // Importamos useRouter

export default function AddEventPage() {
  const { petId } = usePetContext();
  const { refetch } = useFetchEvents(petId || "");
  const router = useRouter(); // Instanciamos el router

  if (!petId) {
    return <p className="text-white">Seleccione una mascota primero.</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-accentPurple mb-6 text-center">
        Agregar Nuevo Evento
      </h1>
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <EventForm
          initialData={null}
          petId={petId} // Pasa el petId al formulario
          onSuccess={async () => {
            await refetch(); // Refresca los eventos
            router.push("/"); // Redirige a la página principal
          }}
        />
      </div>
    </div>
  );
}
