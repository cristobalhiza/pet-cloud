export interface IDatabase<T> {
    getAll(collectionName: string): Promise<T[]>;
    add(collectionName: string, data: T): Promise<void>;
  }
  