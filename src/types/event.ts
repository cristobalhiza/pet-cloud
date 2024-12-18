export interface Event {
    id?: string;
    name: string;
    date: string; // Fecha de origen
    daysInterval?: number; // Intervalo en días
    finalDate?: string; // Fecha calculada automáticamente
    description?: string;
  }
  