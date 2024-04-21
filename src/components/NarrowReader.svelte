<script lang="ts">
  import {
    fetchDeckVocab,
    grabXMostFrequentVocab,
    isKnownWord,
    loadAllMediaDecksWithVocabState,
    lookupVocab,
  } from "../util/jpdb_api";
  import { selected_decks, token } from "../state/stores";
  import { DataHandler } from "@vincjo/datatables";
  import Th from "./Th.svelte";
  import ThFilterMinMax from "./ThFilterMinMax.svelte";
  import ThFilter from "./ThFilter.svelte";

  let target_deck: Deck | null = null;
  $: {
    if ($selected_decks.length > 0) {
      target_deck = $selected_decks[$selected_decks.length - 1];
      results = [];
      resetUiHandlers();
    }
  }

  let decks: DeckWithVocabState[];
  let results: (DeckWithVocabState & { coverage_delta: number })[] = [];
  let absolute_min_words = 0;
  let absolute_max_words = 0;
  let handler = new DataHandler(results);
  let rows = handler.getRows();
  let learnahead = 200;

  function resetUiHandlers() {
    // UI Stuff, should probably be in another function / Component
    handler = new DataHandler(results);
    rows = handler.getRows();
    absolute_min_words = results
      .map((it) => it.word_count)
      .reduce((acc, curr) => Math.min(acc, curr), 0);
    absolute_max_words = results
      .map((it) => it.word_count)
      .reduce((acc, curr) => Math.max(acc, curr), 0);
  }

  async function doTheThing() {
    if (!target_deck) {
      return;
    }
    decks = [];
    const target_deck_with_vocab = await fetchDeckVocab($token, target_deck);
    const target_deck_vocab = await lookupVocab(
      $token,
      target_deck_with_vocab.vocabs,
    );
    const promise = loadAllMediaDecksWithVocabState($token);

    const learnable_map = new Map();
    let target_deck_known_words = 0;
    let target_deck_total_words = 0;
    for (const vocab of target_deck_vocab) {
      if (vocab.state[0] === "blacklisted") {
        continue;
      }
      target_deck_total_words += vocab.occurences;
      if (isKnownWord(vocab)) {
        target_deck_known_words += vocab.occurences;
      } else {
        const key = `${vocab.vid},${vocab.sid}`;
        learnable_map.set(key, vocab);
      }
    }
    decks = await promise;

    const coverage =
      100.0 * (target_deck_known_words / target_deck_total_words);
    console.log("Target Deck: " + target_deck.name);
    console.log("Calculated coverage: " + coverage);
    console.log("Learnable words: " + learnable_map.size);

    // intersect with the target deck vocab and check how learning from this deck changes target deck coverage
    results = [];
    for (const deck of decks) {
      // grab the X most frequent learnable cards
      const vocabs = grabXMostFrequentVocab(deck.vocabs, learnahead);
      let delta = 0;
      for (const vocab of vocabs) {
        const key = `${vocab.vid},${vocab.sid}`;
        const target_vocab: VocabWithStateFrequency | undefined =
          learnable_map.get(key);
        delta += target_vocab?.occurences ?? 0;
      }
      console.log("Delta: " + delta);
      const new_coverage =
        (100.0 * (target_deck_known_words + delta)) / target_deck_total_words;
      const delta_coverage = new_coverage - coverage;
      results.push({ ...deck, coverage_delta: delta_coverage });
    }
    resetUiHandlers();
  }
</script>

<div>
  <h3>NarrowReader</h3>
  <p>Pick a target deck on the left.</p>
  <p>
    This tool will tell you how learning the {learnahead} most frequent words from
    another deck will change the target decks coverage.
  </p>
  <p>
    Decks are picked according to the same criteria as in the CoverageOverview
    tool.
  </p>

  <p>Current Deck: {target_deck?.name ?? "None. Select one to the left"}</p>

  <button on:click={doTheThing} disabled={!target_deck}>Do the Thing!</button>
  {#if results.length > 0}
    <table>
      <thead>
        <tr>
          <Th {handler} orderBy="name">Name</Th>
          <Th {handler} orderBy="word_count">Words</Th>
          <Th {handler} orderBy="learning_coverage">
            Learning
            <br />
            Coverage
          </Th>
          <Th {handler} orderBy="coverage_delta">Coverage Delta</Th>
        </tr>
        <tr>
          <ThFilter {handler} filterBy="name" />
          <ThFilterMinMax
            {handler}
            filterBy="word_count"
            min={absolute_min_words}
            max={absolute_max_words}
          />
          <ThFilterMinMax {handler} filterBy="learning_coverage" />
          <ThFilterMinMax {handler} filterBy="coverage_delta" />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr>
            <td>{row.name}</td>
            <td>{row.word_count}</td>
            <td>{row.learning_coverage.toFixed(2)}</td>
            <td>{row.coverage_delta.toFixed(3)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  td:first-child {
    width: 400px;
    text-align: left;
  }
  tbody tr:nth-child(2n + 1) {
    background-color: #ddd;
  }
  table {
    border: 1px solid #000000;
  }
  tr {
    border: 1px solid #000000;
  }
  td {
    text-align: right;
  }

  thead tr td {
    border-bottom: 1px solid #e0e0e0;
    background: inherit;
    margin: 0;
    padding: 8px 20px;
  }
</style>
