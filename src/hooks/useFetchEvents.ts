import { useEffect, useState } from "react";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { Event } from "@/types/event";

const db = new FirestoreDatabase<Event>("events");

export function useFetchEvents(petId: string | null) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEvents = async () => {
    setLoading(true);
    if (!petId) {
      setEvents([]);
      setLoading(false);
      return;
    }
    try {
      const data = await db.getByPetId(petId);
      setEvents(data);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async (newEvent?: Omit<Event, "id">) => {
    if (newEvent) {
      await db.add(newEvent);
    }
    await fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, [petId]);

  return { events, loading, refetch };
}
