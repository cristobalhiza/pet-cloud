export interface Event {
    id?: string;
    title: string;
    date: string; // Fecha de origen
    daysInterval?: number; // Intervalo en días
    finalDate?: string; // Fecha calculada automáticamente
    description?: string;
  }
  