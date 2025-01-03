"use client";

import { useState } from "react";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { Pet } from "@/types/pet";
import { toast } from "react-toastify";

const db = new FirestoreDatabase<Pet>("pet");

export default function ProfileForm({
  initialData,
  onSuccess,
}: {
  initialData: Partial<Pet> | null;
  onSuccess: (updatedPet: Partial<Pet>) => Promise<void>;
}) {
  const [profile, setProfile] = useState<Partial<Pet>>(initialData || {});
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === "weight" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = async () => {
    if (!profile.name || !profile.birthDate || !profile.specie) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    setSaving(true);
    try {
      await onSuccess(profile); 
    } catch (error) {
      console.error("Error al guardar mascota:", error);
      toast.error("Ocurrió un error al guardar la mascota.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-dark rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 text-dark">
        <input
          type="text"
          name="name"
          placeholder="Nombre *"
          value={profile.name || ""}
          onChange={handleChange}
          className="w-full p-3 border rounded bg-lightGray"
        />
        <input
          type="date"
          name="birthDate"
          value={profile.birthDate || ""}
          onChange={handleChange}
          className="w-full p-3 border rounded bg-lightGray"
        />
        <select
          name="specie"
          value={profile.specie || ""}
          onChange={handleChange}
          className="w-full p-3 border rounded bg-lightGray"
        >
          <option value="" disabled>
            Selecciona la especie *
          </option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
          <option value="Otro">Otro</option>
        </select>
        <input
          type="text"
          name="breed"
          placeholder="Raza"
          value={profile.breed || ""}
          onChange={handleChange}
          className="w-full p-3 border rounded bg-lightGray"
        />
        <input
          type="number"
          name="weight"
          placeholder="Peso"
          value={profile.weight || ""}
          onChange={handleChange}
          className="w-full p-3 border rounded bg-lightGray"
        />
        <input
          type="text"
          name="photo"
          placeholder="URL de la Foto"
          value={profile.photo || ""}
          onChange={handleChange}
          className="w-full p-3 border rounded bg-lightGray"
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={profile.description || ""}
          onChange={handleChange}
          className="w-full p-3 border rounded bg-lightGray resize-none md:col-span-2"
          rows={4}
        />
      </div>
      <div className="flex justify-center mt-6">
    <button
      onClick={handleSave}
      disabled={saving}
      className={`w-96 p-3 rounded-lg text-dark font-semibold ${
        saving
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-accentPurple border-solid border-2 border-transparent hover:bg-lightGray"
      }`}
    >
      {saving ? "Guardando..." : "Guardar Cambios"}
    </button>
  </div>
    </div>
  );
}

