import { useEffect, useState, useCallback } from "react";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { Pet } from "@/types/pet";

const db = new FirestoreDatabase<Pet>("pet");

export function useFetchProfile(petId: string | null) {
    const [profile, setProfile] = useState<Pet | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchProfile = useCallback(async (updatedPet?: Partial<Pet>) => {
        if (!petId) return;
        setLoading(true);
        try {
            if (updatedPet) {
                await db.update(petId, updatedPet);
            }
            const data = await db.getOne(petId);
            setProfile(data);
        } catch (error) {
            console.error("Error al obtener el perfil:", error);
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => {
        if (petId) {
            fetchProfile();
        }
    }, [petId, fetchProfile]);


    return { profile, loading, refetch: fetchProfile };
}
