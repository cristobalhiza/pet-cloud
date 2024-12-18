export interface Pet {
    id?: string; // Opcional si lo usamos para Firestore
    name: string;
    birthDate: string; // Formato de fecha: "YYYY-MM-DD"
    specie: string; // Ejemplo: "Perro", "Gato", etc.
    breed: string; // Raza de la mascota
    weight: number; // Peso en kg
    description?: string; // Descripción opcional
    photo?: string; // URL de la foto
  }  