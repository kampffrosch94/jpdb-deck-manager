<script lang="ts">
  import { token } from "../../state/stores";
  import { loadAllMediaDecksWithVocabState } from "../../util/jpdb_api";
  import CoDeckList from "./CODeckList.svelte";

  let decks: DeckWithVocabState[] = [];
  let startTime: number;

  async function doTheThing() {
    // grab all vocab from all relevant decks and combine it
    // ask api for state
    // sort the vocab state into decks
    // calculate coverages
    decks = [];
    decks = await loadAllMediaDecksWithVocabState($token);
  }
</script>

<p>
  This tool gives an overview over how coverage changes with more vocab learned
  for all decks where wordcount &gt; 3*vocabcount.
</p>
<p>The first load may take a minute or two.</p>
<button on:click={doTheThing}>Do the Thing!</button>

<div>
  {#if decks.length > 0}
    <CoDeckList {decks} {startTime} />
  {/if}
</div>
