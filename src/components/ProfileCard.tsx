"use client";

import { useEffect, useState } from "react";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { Pet } from "@/types/pet";
import ProfileForm from "./ProfileForm";

const db = new FirestoreDatabase<Pet>("pet");

export default function ProfileCard() {
  const [profile, setProfile] = useState<Pet | null>(null);
  const [editing, setEditing] = useState(false);

  // Función para cargar el perfil desde la base de datos
  const fetchProfile = async () => {
    try {
      const data = await db.getOne("profile");
      setProfile(data);
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const calculateAge = (birthDate: string): string => {
    const birth = new Date(birthDate);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    const adjustedMonths = months < 0 ? months + 12 : months;
    return `${years} años y ${adjustedMonths} meses`;
  };

  return editing ? (
    <ProfileForm
      initialData={profile}
      onSuccess={() => {
        setEditing(false);
        fetchProfile(); // Recargar el perfil después de guardar
      }}
    />
  ) : (
    <div className="text-white">
      {profile ? (
        <>
          <p><strong>Edad:</strong> {calculateAge(profile.birthDate)}</p>
          <p><strong>Peso:</strong> {profile.weight} kg</p>
          <p><strong>Raza:</strong> {profile.breed}</p>
          <p><strong>Fecha de Nacimiento:</strong> {profile.birthDate}</p>
          <p><strong>Descripción:</strong> {profile.description}</p>
        </>
      ) : (
        <p>Cargando perfil...</p>
      )}
      <button
        onClick={() => setEditing(true)}
        className="mt-4 bg-accentPurple text-white p-2 rounded"
      >
        Editar Perfil
      </button>
    </div>
  );
}
