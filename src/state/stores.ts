import { writable, type Writable } from 'svelte/store';

export const selected_decks: Writable<Deck[]>  = writable([]);
