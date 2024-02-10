import Dexie, { type Table } from 'dexie';

export interface CachedDeck {
  id?: number;
  text: string;
}

export class CacheDB extends Dexie {
  decks!: Table<CachedDeck>;

  constructor() {
    super('cacheDB');
    this.version(1).stores({
      decks: '++id, text' // Primary key and indexed props
    });
  }
}

export const db = new CacheDB();

