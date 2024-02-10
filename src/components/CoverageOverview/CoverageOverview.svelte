<script lang="ts">
    import { token } from "../../state/stores";
    import { compress, decompress } from "lz-string";
    import {
        fetchDeckVocab,
        fetchDecks,
        lookupVocab,
        merge_vocab,
    } from "../../util/jpdb_api";
    import CoDeckList from "./CODeckList.svelte";
    import { db } from "../../state/db";

    let decks: DeckWithVocabState[] = [];
    let startTime: number;

    async function loadCachedDeck(deck: Deck): Promise<DeckWithVocab | null> {
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
            return o;
        } catch (error) {
            console.error(`Error loading cached element: ${error}`);
            return null;
        }
    }

    async function saveDeckToCache(deck: DeckWithVocab) {
        try {
            const text = compress(JSON.stringify(deck));
            await db.decks.add({ id: deck.id, text: text });
        } catch (error) {
            console.error(`Error caching element: ${error}`);
        }
    }

    async function doTheThing() {
        // grab all vocab from all relevant decks and combine it
        // ask api for state
        // sort the vocab state into decks
        // calculate coverages
        decks = [];

        startTime = Date.now();
        console.log(`[${Date.now() - startTime}] Starting`);
        const fetched = await fetchDecks($token);
        const relevant_decks = fetched.filter(
            (it) => it.word_count > it.vocab_count * 3,
        );

        const vocabss: Vocab[][] = [];
        const v_decks = [];
        for (const deck of relevant_decks) {
            let vd = await loadCachedDeck(deck);
            if (vd === null) {
                vd = await fetchDeckVocab($token, deck);
                saveDeckToCache(vd);
            }

            vocabss.push(vd.vocabs);
            v_decks.push(vd);
        }

        console.log(`[${Date.now() - startTime}] Done with fetching`);

        // get vocab state of all decks in one request, then merge it back into the individual ones
        const vocab_ids = merge_vocab(vocabss, 1);
        const vocabs_looked_up = await lookupVocab($token, vocab_ids);
        const vocabs_map = new Map();
        for (const vocab of vocabs_looked_up) {
            const key = `${vocab.vid},${vocab.sid}`;
            vocabs_map.set(key, vocab);
        }
        console.log(`[${Date.now() - startTime}] Done with lookup`);

        decks = v_decks.map((deck) => {
            let r: VocabWithStateFrequency[] = [];
            for (const vocab of deck.vocabs) {
                const key = `${vocab.vid},${vocab.sid}`;
                let stateful = vocabs_map.get(key);
                r.push({
                    ...vocab,
                    state: stateful.state,
                    frequency: stateful.frequency,
                });
            }
            console.log(`[${Date.now() - startTime}] Done with ${deck.name}`);
            return { ...deck, vocabs: r };
        });
    }
</script>

<p>
    This tool gives an overview over how coverage changes with more vocab
    learned for all decks where wordcount &gt; 3*vocabcount.
</p>
<p>The first load may take a minute or two.</p>
<button on:click={doTheThing}>Do the Thing!</button>

<div>
    {#if decks.length > 0}
        <CoDeckList {decks} {startTime} />
    {/if}
</div>
