"use client";

import { useEffect, useState } from "react";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { Pet } from "@/types/pet";
import ProfileForm from "./ProfileForm";

const db = new FirestoreDatabase<Pet>("pet");

export default function ProfileCard({ petId }: { petId: string }) {
  const [profile, setProfile] = useState<Pet | null>(null);
  const [editing, setEditing] = useState(false);

  // Función para obtener los datos de la mascota seleccionada
  const fetchProfile = async () => {
    try {
      if (!petId) return; // No llamar si no hay un petId válido
      const data = await db.getOne(petId);
      setProfile(data);
    } catch (error) {
      console.error("Error al cargar el perfil de la mascota:", error);
    }
  };

  // Ejecutar fetchProfile cada vez que petId cambie
  useEffect(() => {
    fetchProfile();
  }, [petId]); // Solo depende de petId

  // Función para calcular la edad
  const calculateAge = (birthDate: string): string => {
    const birth = new Date(birthDate);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    const adjustedMonths = months < 0 ? months + 12 : months;
    return `${years} años y ${adjustedMonths} meses`;
  };

  // Renderizado del componente
  return editing ? (
    <ProfileForm
      initialData={profile}
      onSuccess={async () => {
        setEditing(false);
        await fetchProfile(); // Refrescar datos del perfil
      }}
    />
  ) : (
<div className="text-white p-6 bg-gray-800 rounded-lg shadow-md">
  {profile ? (
    <>
      {profile.photo && (
        <img
          src={profile.photo}
          alt={`Foto de ${profile.name}`}
          className="w-52 h-52 mx-auto object-cover rounded-full mb-6 border-4 border-gray-700"
        />
      )}
      <div className="space-y-4">
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-300">Nombre:</span>
          <span className="text-white">{profile.name}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-300">Edad:</span>
          <span className="text-white">{calculateAge(profile.birthDate)}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-300">Especie:</span>
          <span className="text-white">{profile.specie || "No especificada"}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-300">Peso:</span>
          <span className="text-white">{profile.weight || "No registrado"} kg</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-semibold text-gray-300">Raza:</span>
          <span className="text-white">{profile.breed || "No registrada"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-300">Descripción:</span>
          <span className="text-white text-right">
            {profile.description || "Sin descripción"}
          </span>
        </div>
      </div>
      <button
        onClick={() => setEditing(true)}
        className="mt-6 w-full bg-accentPurple text-white font-semibold p-2 rounded-lg hover:bg-purple-700 transition"
      >
        Editar Perfil
      </button>
    </>
  ) : (
    <p className="text-center text-gray-400">Cargando perfil...</p>
  )}
</div>
  );
}
