<script lang="ts">
    import CoDeckList from "./CODeckList.svelte";

    export let decks: Deck[];

    async function doTheThing() {
        // grab all vocab from all relevant decks and combine it
        // ask api for state
        // sort the vocab state into decks
        // calculate coverages
    }
</script>

<button on:click={doTheThing} >Do the Thing!</button>

<div>
    <CoDeckList {decks} />
</div>
