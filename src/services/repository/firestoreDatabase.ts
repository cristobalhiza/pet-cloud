import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export default class FirestoreDatabase<T> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  async getAll(): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  }

  async getByPetId(petId: string): Promise<T[]> {
    const q = query(
      collection(db, this.collectionName),
      where("petId", "==", petId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  }

  async add(data: Omit<T, "id">): Promise<string> {
    const docRef = await addDoc(collection(db, this.collectionName), data);
    return docRef.id; // Retorna el ID generado
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, data);
  }

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
