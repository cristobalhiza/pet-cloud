"use client";

import { useEffect, useState } from "react";
import FirestoreDatabase from "../services/repository/firestoreDatabase";
import { Event } from "@/types/event";

// Crear una instancia para la colección 'events'
const db = new FirestoreDatabase<Event>("events");

export function useFetchEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getAll()
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => {
        console.error("Error al obtener eventos:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { events, loading };
}
