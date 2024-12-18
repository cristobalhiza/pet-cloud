import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getFirestore,
} from "firebase/firestore";
import { db } from "../firebase";

// Clase genérica para Firestore CRUD
export default class FirestoreDatabase<T> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Obtener todos los documentos
  async getAll(): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  }

  // Agregar un nuevo documento
  async add(data: Omit<T, "id">): Promise<void> {
    await addDoc(collection(db, this.collectionName), data);
  }

  // Actualizar un documento existente
  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, data);
  }

  // Eliminar un documento
  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }
  async getOne(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null;
  }
  
}
