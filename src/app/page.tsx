"use client";

import { useState } from "react";
import EventList from "@/components/EventList";
import ProfileCard from "@/components/ProfileCard";
import EventForm from "@/components/EventForm";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { toast } from "react-toastify";
import ProfileForm from "@/components/ProfileForm";
import { Pet } from "@/types/pet";
import { usePetContext } from "@/context/PetContext";
import { useRef } from "react";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { useFetchEvents } from "@/hooks/useFetchEvents";
import { useFetchPets } from "@/hooks/useFetchPets";
import { useFetchProfile } from "@/hooks/useFetchProfile";
import Image from 'next/image';
import Modal from "@/components/Modal";

const db = new FirestoreDatabase<Pet>("pet");

export default function Home() {
  const { petId, setPetId } = usePetContext();
  const { pets, refetchPets } = useFetchPets(setPetId);
  const { events, refetch } = useFetchEvents(petId || "");
  const { profile } = useFetchProfile(petId);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const addingRef = useRef(false);

  const handleAddPet = async (newPet: Partial<Pet>) => {
    if (addingRef.current) return;
    addingRef.current = true;

    try {
      const newPetId = await db.add(newPet as Omit<Pet, "id">);

      await refetchPets();
      setPetId(newPetId);

      setShowModal(false);
      toast.success("Mascota agregada correctamente");
    } catch {
      toast.error("Error al agregar mascota");
    } finally {
      addingRef.current = false;
    }
  };


  const handleDeletePet = async () => {
    if (!petId) return;
    try {
      await db.delete(petId);
      await refetchPets();
      if (pets.length > 1) {
        const nextPet = pets.find((pet) => pet.id !== petId);
        setPetId(nextPet ? nextPet.id : null);
      } else {
        setPetId(null);
      }

      toast.success("Mascota eliminada correctamente");
    } catch {
      toast.error("Error al eliminar mascota");
    }
  };


  const handleEventAdded = async () => {
    await refetch();
    setShowAddEvent(false);
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-dark text-lightGray">
      <div className="mb-6 w-full flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        {/* Title */}
        <div className="flex flex-col md:flex-row items-center justify-center flex-1 gap-4 mr-5">
          <h1 className="text-3xl md:text-4xl font-bold text-orange">
            Pet Cloud
          </h1>
          <Image
            src="/icons8-paw-66.png"
            alt="Paw Icon"
            width={50}
            height={50}
          />
        </div>

        {/*  Google Auth and pet */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-6">
          <div className="flex flex-col items-center justify-center md:items-start">
            <h2 className="sm:text-lg font-semibold text-lightGray mb-2 sm:mb-4">
              Sincronización con Google Calendar
            </h2>
            <GoogleAuthButton />
          </div>
          <div className="p-4 rounded-lg shadow-md flex flex-col items-center justify-center md:justify-start md:items-start">
            <h2 className="sm:text-lg font-semibold text-lightGray mb-2 sm:mb-4">
              Selecciona una Mascota
            </h2>
            <select
              value={petId || ""}
              onChange={(e) => setPetId(e.target.value)}
              className="w-full p-2 border border-orange rounded bg-dark text-lightGray max-w-64"
            >
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
            <div className="flex flex-row gap-2 mt-2 sm:mt-4">
              {petId && (
                <button
                  onClick={handleDeletePet}
                  className="text-black bg-orange p-2 rounded hover:bg-beige transition text-sm"
                >
                  Eliminar Mascota
                </button>
              )}
              <button
                onClick={() => setShowModal(true)}
                className="text-black bg-orange p-2 rounded hover:bg-beige transition text-sm"
              >
                Agregar Mascota
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <div className="bg-mediumGray p-4 sm:p-6 rounded shadow-lg flex flex-col justify-between h-full">
          <h2 className="text-2xl sm:text-3xl mb-4 sm:mb-8 font-bold text-dark text-center">
            {profile ? `${profile.name}` : "Cargando perfil..."}
          </h2>
          {petId && <ProfileCard petId={petId} />}
        </div>

        <div className="bg-mediumGray p-4 sm:p-6 rounded shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-dark">
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
        <Modal
          onClose={() => setShowAddEvent(false)}
          title="Agregar Nuevo Evento"
        >
          <EventForm initialData={null} petId={petId} onSuccess={handleEventAdded} />
        </Modal>
      )}

      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          title="Agregar Nueva Mascota"
        >
          <ProfileForm
            initialData={null}
            onSuccess={async (newPet) => await handleAddPet(newPet)}
          />
        </Modal>
      )}
    </div>

  );
}
