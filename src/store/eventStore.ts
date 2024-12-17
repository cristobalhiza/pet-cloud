import { create } from "zustand";
import FirestoreDatabase from "@/services/repository/firestoreDatabase";
import { Event } from "@/types/event";

// Instancia FirestoreDatabase con la colección 'events'
const db = new FirestoreDatabase<Event>("events");

interface EventState {
  events: Event[];
  fetchEvents: () => Promise<void>;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  fetchEvents: async () => {
    try {
      const data = await db.getAll();
      set({ events: data });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  },
}));

// Llamada inicial
useEventStore.getState().fetchEvents();
