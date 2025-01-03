"use client";

import { useState, useEffect } from "react";
import EventList from "@/components/EventList";
import ProfileCard from "@/components/ProfileCard";
import EventForm from "@/components/EventForm"; // Importamos el formulario de eventos
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { toast } from "react-toastify";
import ProfileForm from "@/components/ProfileForm";
import { Pet } from "@/types/pet";
import { usePetContext } from "@/context/PetContext";
import { useRef } from "react";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { useFetchEvents } from "@/hooks/useFetchEvents";

const db = new FirestoreDatabase<Pet>("pet");

export default function Home() {
  const { petId, setPetId } = usePetContext();
  const { events, loading, refetch } = useFetchEvents(petId || ""); 
  const [pets, setPets] = useState<Pet[]>([]);
  const [profile, setProfile] = useState<Pet | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const addingRef = useRef(false);

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
  }, [petId]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!petId) {
        setProfile(null);
        return;
      }
      try {
        const data = await db.getOne(petId);
        setProfile(data);
      } catch (error) {
        console.error("Error al cargar el perfil de la mascota:", error);
      }
    };

    fetchProfile();
  }, [petId]);

  const handleAddPet = async (newPet: Partial<Pet>) => {
    if (addingRef.current) return;
    addingRef.current = true;

    try {
      const newId = await db.add(newPet as Omit<Pet, "id">);
      const updatedPets = await db.getAll();
      setPets(updatedPets);
      setPetId(newId);
      setShowModal(false);
      toast.success("Mascota agregada correctamente");
    } catch (error) {
      toast.error("Error al agregar mascota");
    } finally {
      addingRef.current = false;
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
      toast.error("Error al eliminar mascota");
    }
  };

  const handleEventAdded = async () => {
    await refetch();
    setShowAddEvent(false);
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-dark text-lightGray">
      <div className="mb-6 w-full flex flex-col sm:flex-row sm:items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange text-center sm:text-left sm:flex-1 my-2 sm:my-0">
        My Pet Cloud 🐾
        </h1>
        <div className="mt-4 sm:mt-0 flex flex-col">
          <h2 className="text-lg sm:text-xl font-semibold text-lightGray mb-2 sm:mb-4">
            Sincronización con Google Calendar
          </h2>
          <GoogleAuthButton />
        </div>
        <div className="mt-4 sm:mt-0 p-4 rounded-lg shadow-md flex-2">
          <h2 className="text-lg sm:text-xl font-semibold text-lightGray mb-2 sm:mb-4">
            Selecciona una Mascota
          </h2>
          <select
            value={petId || ""}
            onChange={(e) => setPetId(e.target.value)}
            className="w-full p-2 border border-orange rounded bg-dark text-lightGray"
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
              className="mt-2 sm:mt-4 mr-2 sm:mr-6 text-black bg-orange p-2 rounded hover:bg-beige transition"
            >
              Eliminar Mascota
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 sm:mt-0 sm:ml-2 text-black bg-orange p-2 rounded hover:bg-beige transition"
          >
            Agregar Mascota
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <div className="bg-mediumGray p-4 sm:p-6 rounded shadow-lg flex flex-col justify-between h-full">
          <h2 className="text-3xl sm:text-4xl mb-4 sm:mb-8 font-bold text-dark text-center">
            {profile ? `${profile.name}` : "Cargando perfil..."}
          </h2>
          {petId && <ProfileCard petId={petId} />}
        </div>

        <div className="bg-mediumGray p-4 sm:p-6 rounded shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-dark">
            Vacunas y Eventos
          </h2>
          {petId && <EventList events={events} onDelete={refetch} />}
          <div className="flex">
            <button
              onClick={() => setShowAddEvent(true)}
              className="mt-4 w-full sm:w-96 bg-accentPurple text-dark font-semibold mx-auto p-2 rounded-lg border-solid border-2 border-transparent hover:border-dark transition"
            >
              + Agregar Evento
            </button>
          </div>
        </div>
      </div>

      {showAddEvent && petId && (
        <div className="fixed inset-0 bg-dark bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark p-4 sm:p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setShowAddEvent(false)}
              className="absolute top-2 right-2 text-black font-bold bg-orange p-2 rounded-full hover:bg-beige"
            >
              ✕
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-orange text-center mb-4">
              Agregar Nuevo Evento
            </h2>
            <EventForm initialData={null} petId={petId} onSuccess={handleEventAdded} />
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-dark bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-mediumGray p-4 sm:p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-black font-bold bg-orange p-2 rounded-full hover:bg-beige"
            >
              ✕
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-dark mb-4 sm:m-6">
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
