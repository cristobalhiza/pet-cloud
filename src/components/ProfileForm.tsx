"use client";

import { useState, useEffect } from "react";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { Pet } from "@/types/pet";

const db = new FirestoreDatabase<Pet>("pet");

export default function ProfileForm({
  initialData,
  onSuccess,
}: {
  initialData: Pet | null;
  onSuccess: () => void;
}) {
  const [profile, setProfile] = useState<Partial<Pet>>(initialData || {});
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === "weight" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await db.update("profile", profile);
      alert("Perfil actualizado correctamente.");
      onSuccess();
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-darkCard rounded">
      <h1 className="text-2xl font-bold mb-4 text-accentPurple">Editar Perfil de la Perrita</h1>

      <input
        type="text"
        name="name"
        placeholder="Nombre"
        value={profile.name || ""}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded bg-gray-800 text-white"
      />
      <input
        type="date"
        name="birthDate"
        value={profile.birthDate || ""}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded bg-gray-800 text-white"
      />
      <input
        type="text"
        name="breed" 
        placeholder="Especie"
        value={profile.breed || ""}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded bg-gray-800 text-white"
      />
      <input
        type="number"
        name="weight"
        placeholder="Peso"
        value={profile.weight || ""}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded bg-gray-800 text-white"
      />
      <textarea
        name="description"
        placeholder="Descripción"
        value={profile.description || ""}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded bg-gray-800 text-white"
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-accentPurple text-white p-2 rounded hover:bg-purple-700"
      >
        {saving ? "Guardando..." : "Guardar Perfil"}
      </button>
    </div>
  );
}
