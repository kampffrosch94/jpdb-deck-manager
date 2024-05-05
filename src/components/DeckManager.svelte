<script lang="ts">
  import DeckList from "./DeckList.svelte";
  import "../util/jpdb_api";
  import { fetchDecks } from "../util/jpdb_api";
  import { logged_in, result, selected_decks, token } from "../state/stores";
  import DeckMerger from "./DeckMerger.svelte";
  import DeckYeeter from "./DeckYeeter.svelte";
  import Login from "./Login.svelte";
  import DeckCoverage from "./DeckCoverage.svelte";
  import CoverageOverview from "./CoverageOverview/CoverageOverview.svelte";
  import NarrowReader from "./NarrowReader.svelte";

  enum CurrentPage {
    DeckMerger,
    DeckYeeter,
    DeckCoverage,
    CoverageOverview,
    NarrowReader,
  }
  let currentPage = CurrentPage.DeckMerger;

  let decks: Deck[] = [];

  async function loadDecks() {
    decks = await fetchDecks($token);
  }
</script>

{#if !$logged_in}
  <Login on:login={loadDecks} />
{:else}
  <a
    href={"#"}
    on:click={(e) => {
      e.preventDefault();
      currentPage = CurrentPage.DeckMerger;
      $selected_decks = [];
    }}
  >
    DeckMerger
  </a>
  <a
    href={"#"}
    on:click={(e) => {
      e.preventDefault();
      currentPage = CurrentPage.DeckYeeter;
      $selected_decks = [];
    }}
  >
    DeckYeeter
  </a>
  <a
    href={"#"}
    on:click={(e) => {
      e.preventDefault();
      currentPage = CurrentPage.DeckCoverage;
      $selected_decks = [];
    }}
  >
    DeckCoverage
  </a>
  <a
    href={"#"}
    on:click={(e) => {
      e.preventDefault();
      currentPage = CurrentPage.CoverageOverview;
      $selected_decks = [];
    }}
  >
    CoverageOverview
  </a>
  <a
    href={"#"}
    on:click={(e) => {
      e.preventDefault();
      currentPage = CurrentPage.NarrowReader;
      $selected_decks = [];
    }}
  >
    NarrowReader
  </a>
  <p>Result:</p>
  <pre>{$result}</pre>

  {#if currentPage === CurrentPage.CoverageOverview}
    <CoverageOverview />
  {:else}
    <button type="button" on:click={loadDecks}>Reload decks</button>
    <div class="container">
      <DeckList {decks} />
      {#if currentPage === CurrentPage.DeckMerger}
        <DeckMerger />
      {/if}
      {#if currentPage === CurrentPage.DeckYeeter}
        <DeckYeeter on:deleted_decks={loadDecks} />
      {/if}
      {#if currentPage === CurrentPage.DeckCoverage}
        <DeckCoverage />
      {/if}
      {#if currentPage === CurrentPage.NarrowReader}
        <NarrowReader />
      {/if}
    </div>
  {/if}
{/if}

<style>
  .container {
    display: flex;
    gap: 50px;
  }
</style>
