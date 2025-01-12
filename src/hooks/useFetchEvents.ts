import { useEffect, useState, useCallback } from "react";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { Event } from "@/types/event";

const db = new FirestoreDatabase<Event>("events");

export function useFetchEvents(petId: string | null) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEvents = useCallback(async () => {
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
  }, [petId]);

  const refetch = async (event?: Partial<Event>) => {
    if (event) {
      if (event.id) {
        await db.update(event.id, event);
      } else {
        await db.add(event as Omit<Event, "id">);
      }
    }
    await fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, refetch };
}
