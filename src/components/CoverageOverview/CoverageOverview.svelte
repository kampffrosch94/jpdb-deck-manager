<script lang="ts">
    import { token } from "../../state/stores";
    import { fetchDeckVocab, fetchDecks, lookupVocab, merge_vocab } from "../../util/jpdb_api";
    import CoDeckList from "./CODeckList.svelte";

    
    let decks: DeckWithVocabState[] = [];

    async function doTheThing() {
        // grab all vocab from all relevant decks and combine it
        // ask api for state
        // sort the vocab state into decks
        // calculate coverages
        decks = []

        const fetched = await fetchDecks($token);
        const relevant_decks = fetched.filter(
            (it) => it.word_count > it.vocab_count * 15,
        );
        
        const vocabss: Vocab[][] = [];
        const v_decks = []
        for (const deck of relevant_decks) {
            // TODO insert caching here
            const vd = (await fetchDeckVocab($token, deck));
            vocabss.push(vd.vocabs);
            v_decks.push(vd);
        }
        
        // get vocab state of all decks in one request, then merge it back into the individual ones
        const vocab_ids = merge_vocab(vocabss, 1);
        const vocabs_looked_up = await lookupVocab($token, vocab_ids);
        const vocabs_map = new Map();
        for (const vocab of vocabs_looked_up) {
            const key = `${vocab.vid},${vocab.sid}`;
            vocabs_map.set(key, vocab);
        }
        
        decks = v_decks.map((deck) => {
            let r: VocabWithStateFrequency[] = [];
            for (const vocab of deck.vocabs) {
                const key = `${vocab.vid},${vocab.sid}`;
                let stateful =vocabs_map.get(key)
                r.push(stateful);
            }
            return {...deck, vocabs: r};
        });
    }
</script>

<button on:click={doTheThing}>Do the Thing!</button>

<div>
    {#if decks.length > 0}
        <CoDeckList {decks} />
    {/if}
</div>
