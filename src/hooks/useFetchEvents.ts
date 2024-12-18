"use client";

import { useEffect, useState } from "react";
import FirestoreDatabase from "../services/repository/firestoreDatabase";
import { Event } from "@/types/event";

const db = new FirestoreDatabase<Event>("events");

export function useFetchEvents(petId: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await db.getByPetId(petId); // Usa el método getByPetId
      setEvents(data);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (petId) {
      fetchEvents();
    }
  }, [petId]);

  return { events, loading, refetch: fetchEvents };
}


