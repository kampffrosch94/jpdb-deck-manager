import { writable, type Writable } from 'svelte/store';

export const selected_decks: Writable<Deck[]>  = writable([]);
export const token: Writable<string>  = writable("");
export const result: Writable<string>  = writable("");
