export interface GoogleCalendarEventDTO {
    summary: string; // Título del evento
    description?: string; // Descripción del evento
    location?: string; // Ubicación del evento
    start: {
        dateTime?: string; // Fecha y hora de inicio en formato ISO
        date?: string; // Fecha de inicio para eventos de día completo
        timeZone?: string; // Zona horaria (solo para eventos con hora específica)
    };
    end: {
        dateTime?: string; // Fecha y hora de finalización en formato ISO
        date?: string; // Fecha de finalización para eventos de día completo
        timeZone?: string; // Zona horaria (solo para eventos con hora específica)
    };
    reminders?: {
        useDefault: boolean; // Usa recordatorios predeterminados
        overrides?: { method: string; minutes: number }[]; // Métodos y tiempos de recordatorio
    };
}



export const createGoogleCalendarEventDto = (
    title: string,
    description: string | undefined,
    startDate: Date,
    endDate: Date,
    isAllDay: boolean
  ): GoogleCalendarEventDTO => {
    if (isAllDay) {
      return {
        summary: title,
        description,
        start: { date: startDate.toISOString().split("T")[0] }, // Solo fecha
        end: { date: endDate.toISOString().split("T")[0] }, // Solo fecha
      };
    } else {
      return {
        summary: title,
        description,
        start: {
          dateTime: startDate.toISOString(), // Fecha y hora
          timeZone: "America/Los_Angeles", // Ajustar a tu zona horaria
        },
        end: {
          dateTime: endDate.toISOString(), // Fecha y hora
          timeZone: "America/Los_Angeles",
        },
      };
    }
  };
  


