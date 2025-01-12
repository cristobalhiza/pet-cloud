"use client";

import { useState } from "react";
import { Pet } from "@/types/pet";
import ProfileForm from "./ProfileForm";
import { toast } from "react-toastify";
import Image from "next/image";
import { useFetchProfile } from "@/hooks/useFetchProfile";

export default function ProfileCard({ petId }: { petId: string }) {
  const { profile, loading, refetch } = useFetchProfile(petId);
  const [editing, setEditing] = useState(false);


  const calculateAge = (birthDate: string): string => {
    const birth = new Date(birthDate);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    const adjustedMonths = months < 0 ? months + 12 : months;
    return `${years} años y ${adjustedMonths} meses`;
  };

  const handleUpdateProfile = async (updatedPet: Partial<Pet>) => {
    try {
      await refetch(updatedPet);
      toast.success("Perfil actualizado correctamente");
      setEditing(false);
    } catch {
      toast.error("No se pudo actualizar el perfil.");
    }
  };

  return editing ? (
<ProfileForm
  initialData={profile}
  onSuccess={handleUpdateProfile}
/>

  ) : (
    <div className="text-dark px-6 bg-transparent rounded-lg flex flex-col justify-between h-full">
      {loading ? (
        <p className="text-center text-orange">Cargando perfil...</p>
      ) : profile ? (
        <>
          {profile.photo && (
            <Image
              src={profile.photo}
              alt={`Foto de ${profile.name}`}
              className="w-56 h-56 mx-auto object-cover rounded-full mb-6 border-4 border-gray-700"
              width={220}
              height={220} 
            />
          )}
          <div className="space-y-4 sm:text-base">

            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="font-semibold">Edad:</span>
              <span className="font-bold">{calculateAge(profile.birthDate)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="font-semibold ">Peso:</span>
              <span className="font-bold">{profile.weight || "No registrado"} kg</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="font-semibold ">Especie:</span>
              <span className="font-bold">{profile.specie || "No especificada"}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="font-semibold ">Raza:</span>
              <span className="font-bold">{profile.breed || "No registrada"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold ">Descripción:</span>
              <span className="font-semibold text-right">
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
