<script lang="ts">
    import { token } from "../../state/stores";
    import { fetchDeckVocab, fetchDecks, lookupVocab, merge_vocab } from "../../util/jpdb_api";
    import CoDeckList from "./CODeckList.svelte";

    let decks: Deck[] = [];

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
        for (const deck of relevant_decks) {
            // TODO insert caching here
            const vs = (await fetchDeckVocab($token, deck)).vocabs;
            vocabss.push(vs);
        }
        const vocab_ids = merge_vocab(vocabss, 1);
        const vocab_looked_up = await lookupVocab($token, vocab_ids);
        
        
        decks = relevant_decks;
    }
</script>

<button on:click={doTheThing}>Do the Thing!</button>

<div>
    {#if decks.length > 0}
        <CoDeckList {decks} />
    {/if}
</div>
