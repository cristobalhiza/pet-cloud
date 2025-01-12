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
    } catch  {
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
    } catch  {
      toast.error("Error al eliminar mascota");
    }
  };


  const handleEventAdded = async () => {
    await refetch();
    setShowAddEvent(false);
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-dark text-lightGray">
    <div className="mb-6 w-full flex flex-col sm:flex-row sm:justify-between sm:items-center">
      {/* Title */}
      <div className="flex items-center justify-center flex-1 gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange">
          Pet Cloud
        </h1>
        <Image
          src="/icons8-paw-66.png"
          alt="Paw Icon"
          width={66}
          height={66}
        />
      </div>
  
      {/*  Google Auth and pet */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mt-4 sm:mt-0">
        <div className="flex flex-col">
          <h2 className="sm:text-lg font-semibold text-lightGray mb-2 sm:mb-4">
            Sincronización con Google Calendar
          </h2>
          <GoogleAuthButton />
        </div>
        <div className="p-4 rounded-lg shadow-md">
          <h2 className="sm:text-lg font-semibold text-lightGray mb-2 sm:mb-4">
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
              className="mt-2 sm:mt-4 mr-2 sm:mr-6 text-black bg-orange p-2 rounded hover:bg-beige transition text-sm"
            >
              Eliminar Mascota
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 sm:mt-0 sm:ml-2 text-black bg-orange p-2 rounded hover:bg-beige transition text-sm"
          >
            Agregar Mascota
          </button>
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
  
    {/* Modals */}
    {showAddEvent && petId && (
      <div className="fixed inset-0 bg-dark bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-dark p-4 sm:p-6 rounded-lg shadow-lg max-w-lg w-full relative">
          <button
            onClick={() => setShowAddEvent(false)}
            className="absolute top-2 right-2 text-black font-bold bg-orange p-2 rounded-full hover:bg-beige"
          >
            ✕
          </button>
          <h2 className="text-lg sm:text-xl font-bold text-orange text-center mb-4">
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
          <h2 className="text-lg sm:text-xl font-bold text-dark mb-4 sm:m-6">
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
