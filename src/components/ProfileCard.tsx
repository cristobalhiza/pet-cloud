"use client";

import { useEffect, useState } from "react";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { Pet } from "@/types/pet";
import ProfileForm from "./ProfileForm";
import { toast } from "react-toastify";

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

  const handleUpdateProfile = async (updatedPet: Partial<Pet>) => {
    if (!petId) {
      toast.error("No se encontró el ID de la mascota.");
      return;
    }
  
    try {
      await db.update(petId, updatedPet); // Actualizar en Firebase
      await fetchProfile(); // Refrescar datos después de actualizar
      toast.success("Perfil actualizado correctamente");
      setEditing(false); // Salir del modo edición
    } catch (error) {
      toast.error("No se pudo actualizar el perfil.");
    }
  };

  // Renderizado del componente
  return editing ? (
<ProfileForm
  initialData={profile}
  onSuccess={handleUpdateProfile}
/>

  ) : (
    <div className="text-dark px-6 bg-transparent rounded-lg flex flex-col justify-between h-full">
      {profile ? (
        <>
          {profile.photo && (
            <img
              src={profile.photo}
              alt={`Foto de ${profile.name}`}
              className="w-52 h-52 mx-auto object-cover rounded-full mb-6 border-4 border-gray-700"
            />
          )}
          <div className="space-y-4 sm:text-lg">

            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="font-semibold">Edad:</span>
              <span className="">{calculateAge(profile.birthDate)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="font-semibold ">Peso:</span>
              <span className="">{profile.weight || "No registrado"} kg</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="font-semibold ">Especie:</span>
              <span className="">{profile.specie || "No especificada"}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="font-semibold ">Raza:</span>
              <span className="">{profile.breed || "No registrada"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold ">Descripción:</span>
              <span className=" text-right">
                {profile.description || "Sin descripción"}
              </span>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
          <button
            onClick={() => setEditing(true)}
            className="mt-6 w-96 bg-accentPurple text-dark font-semibold mx-auto p-2 rounded-lg border-solid border-2 border-transparent hover:border-dark transition"
          >
            Editar Perfil
          </button>
          </div>
        </>
      ) : (
        <p className="text-center text-orange">Cargando perfil...</p>
      )}
    </div>
  );
}
