import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { Pet } from "@/types/pet";
import { useEffect, useState } from "react";

const db = new FirestoreDatabase<Pet>("pet");

export function useFetchPets(setPetId: (id: string | null) => void) {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchPets = async () => {
        try {
            const data = await db.getAll();
            setPets(data);
            if (data.length > 0 && data[0].id) {
                setPetId(data[0].id);
            }
        } catch (error) {
            console.error("Error al obtener mascotas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, [setPetId]);

    return { pets, loading, refetchPets: fetchPets };
}
