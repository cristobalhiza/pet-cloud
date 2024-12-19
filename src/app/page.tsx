"use client";
import { useState, useEffect } from "react";
import EventList from "@/components/EventList";
import ProfileCard from "@/components/ProfileCard";
import Link from "next/link";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { toast } from "react-toastify";
import ProfileForm from "@/components/ProfileForm";
import { Pet } from "@/types/pet";
import { FiPlus } from "react-icons/fi";
import { usePetContext } from "@/context/PetContext";

const db = new FirestoreDatabase<Pet>("pet");

export default function Home() {
  const [pets, setPets] = useState<Pet[]>([]);
  const { petId, setPetId } = usePetContext();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await db.getAll();
        setPets(data);
        if (data.length > 0 && !petId) {
          setPetId(data[0].id);
        }
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
      }
    };
    fetchPets();
  }, [petId, setPetId]);

  const handleAddPet = async (newPet: Partial<Pet>) => {
    try {
      await db.add(newPet as Omit<Pet, "id">);
      const updatedPets = await db.getAll();
      setPets(updatedPets);
      setPetId(updatedPets[updatedPets.length - 1].id);
      setShowModal(false); // Cerrar el modal después de guardar
      toast.success("Mascota agregada correctamente");
    } catch (error) {
      console.error("Error al agregar mascota:", error);
      toast.error("Error al agregar mascota");
    }
  };

  const handleDeletePet = async () => {
    if (!petId) return;
    try {
      await db.delete(petId);
      const updatedPets = await db.getAll();
      setPets(updatedPets);
      setPetId(updatedPets[0]?.id || null);
      toast.success("Mascota eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar mascota:", error);
      toast.error("Error al eliminar mascota");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <div className="mb-6 w-full flex flex-row">
        <h1 className="text-4xl md:text-5xl font-bold text-accentPurple flex-1 text-center my-auto">
          Rincón de Mascotas 🐾
        </h1>

        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex-2">
          <h2 className="text-xl font-semibold text-accentPurple mb-4">
            Selecciona una Mascota
          </h2>
          <select
            value={petId || ""}
            onChange={(e) => setPetId(e.target.value)}
            className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
          >
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
          {petId && (
            <button
              onClick={handleDeletePet}
              className="mt-4 bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
            >
              Eliminar Mascota
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="text-white bg-accentPurple p-2 rounded hover:bg-purple-700 transition ml-2"
          >
            Agregar Mascota
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-darkCard p-6 rounded shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white text-center">
            Datos Mascota
          </h2>
          {petId && <ProfileCard petId={petId} />}
        </div>

        <div className="bg-darkCard p-6 rounded shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Vacunas y Eventos
          </h2>
          {petId && <EventList petId={petId} />}
          <Link href="/add">
            <button className="mt-4 bg-accentPurple text-white p-2 rounded hover:bg-purple-700 w-full">
              + Agregar Evento
            </button>
          </Link>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-white bg-red-600 p-2 rounded-full hover:bg-red-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-accentPurple">
              Agregar Nueva Mascota
            </h2>
            <ProfileForm
              initialData={null}
              onSuccess={async (newPet) => await handleAddPet(newPet)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
