import Dexie, { type Table } from 'dexie';
import { compress, decompress } from 'lz-string';

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


export async function loadCachedDeck(deck: Deck): Promise<DeckWithVocab | null> {
  try {
    const s = (await db.decks.get(deck.id))?.text;
    if (!s) {
      return null;
    }
    const o: DeckWithVocab = JSON.parse(decompress(s));
    if (
      o.id !== deck.id ||
      o.name !== deck.name ||
      o.word_count != deck.word_count ||
      o.vocab_count != deck.vocab_count
    ) {
      await db.decks.delete(deck.id);
      return null;
    }
    // don't use the coverage etc from the cached deck since it might be outdated
    // we are only interested in its vocab list, which we check to be (very likely) correct
    return {...deck, vocabs: o.vocabs};
  } catch (error) {
    console.error(`Error loading cached element: ${error}`);
    return null;
  }
}

export async function saveDeckToCache(deck: DeckWithVocab) {
  try {
    const text = compress(JSON.stringify(deck));
    await db.decks.add({ id: deck.id, text: text });
  } catch (error) {
    console.error(`Error caching element: ${error}`);
  }
}