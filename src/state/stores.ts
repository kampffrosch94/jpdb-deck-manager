import { writable, type Writable } from 'svelte/store';

export const token: Writable<string>  = writable("");
export const logged_in: Writable<boolean>  = writable(false);
export const result: Writable<string>  = writable("");
export const selected_decks: Writable<Deck[]>  = writable([]);
