<script lang="ts">
  import { loadAllMediaDecksWithVocabState } from "../util/jpdb_api";
  import { selected_decks, token } from "../state/stores";

  let deck: Deck | undefined;
  $: {
    if ($selected_decks.length > 0) {
      deck = $selected_decks[$selected_decks.length - 1];
    }
  }

  let decks;

  async function doTheThing() {
    decks = [];
    decks = await loadAllMediaDecksWithVocabState($token);
  }
</script>

<div>
  <h3>NarrowReader</h3>
  <p>WIP and not working yet !!</p>
  <p>Pick a Deck on the left.</p>
  <p>
    This tool will tell you how learning the 50 most frequent words from another
    Deck will change its coverage.
  </p>
  <p>
    Decks are picked according to the same criteria as in the CoverageOverview
    tool.
  </p>

  <p>Current Deck: {deck?.name}</p>

  <button on:click={doTheThing}>Do the Thing!</button>
</div>