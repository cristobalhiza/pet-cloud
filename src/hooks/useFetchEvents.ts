"use client";

import { useEffect, useState } from "react";
import FirestoreDatabase from "../services/repository/firestoreDatabase";
import { Event } from "@/types/event";

const db = new FirestoreDatabase<Event>("events");

export function useFetchEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await db.getAll();
      setEvents(data);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, refetch: fetchEvents }; // Retorna la función refetch
}
