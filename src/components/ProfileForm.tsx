"use client";

import { useState } from "react";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { Pet } from "@/types/pet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const db = new FirestoreDatabase<Pet>("pet");

export default function ProfileForm({
  initialData,
  onSuccess,
}: {
  initialData: Partial<Pet> | null;
  onSuccess: (newPet: Partial<Pet>) => Promise<void>;
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
    setSaving(true);
    try {
      const { name, birthDate, specie } = profile;
      const missingFields: string[] = [];

      if (!name) missingFields.push("Nombre");
      if (!birthDate) missingFields.push("Fecha de nacimiento");
      if (!specie) missingFields.push("Especie");

      if (missingFields.length > 0) {
        toast.error(
          `Completa los campos obligatorios: ${missingFields.join(", ")}`
        );
        setSaving(false);
        return;
      }

      const petData: Omit<Pet, "id"> = {
        name: profile.name || "",
        birthDate: profile.birthDate || "",
        specie: profile.specie || "",
        weight: profile.weight || 0,
        breed: profile.breed || "",
        description: profile.description || "",
        photo: profile.photo || "",
      };

      await onSuccess(petData); 
      toast.success("Perfil validado correctamente.");
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      toast.error("Error al guardar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-accentPurple">
        Editar Perfil
      </h1>
      <input
        type="text"
        name="name"
        placeholder="Nombre *"
        value={profile.name || ""}
        onChange={handleChange}
        className="w-full p-3 mb-4 border rounded bg-gray-700 text-white"
      />
      <input
        type="date"
        name="birthDate"
        value={profile.birthDate || ""}
        onChange={handleChange}
        className="w-full p-3 mb-4 border rounded bg-gray-700 text-white"
      />
      <select
        name="specie"
        value={profile.specie || ""}
        onChange={handleChange}
        className="w-full p-3 mb-4 border rounded bg-gray-700 text-white"
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
        className="w-full p-3 mb-4 border rounded bg-gray-700 text-white"
      />
      <input
        type="number"
        name="weight"
        placeholder="Peso"
        value={profile.weight || ""}
        onChange={handleChange}
        className="w-full p-3 mb-4 border rounded bg-gray-700 text-white"
      />
      <textarea
        name="description"
        placeholder="Descripción"
        value={profile.description || ""}
        onChange={handleChange}
        className="w-full p-3 mb-4 border rounded bg-gray-700 text-white resize-none"
        rows={4}
      />
      <input
        type="text"
        name="photo"
        placeholder="URL de la Foto"
        value={profile.photo || ""}
        onChange={handleChange}
        className="w-full p-3 mb-4 border rounded bg-gray-700 text-white"
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full p-3 rounded-lg text-white font-semibold ${
          saving
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-accentPurple hover:bg-purple-700"
        }`}
      >
        {saving ? "Guardando..." : "Guardar Perfil"}
      </button>
    </div>
  );
}
