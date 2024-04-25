<script lang="ts">
  import { DataHandler } from "@vincjo/datatables";
  import Th from "../Th.svelte";
  import { learnAheadCoverage } from "../../util/jpdb_api";
  import CoExplanation from "./COExplanation.svelte";
  import ThFilterMinMax from "../ThFilterMinMax.svelte";
  import ThFilter from "../ThFilter.svelte";

  export let decks: DeckWithVocabState[];
  export let startTime: number;

  let min_coverage = 0;
  let absolute_min_words = 0;
  let absolute_max_words = 0;
  let absolute_min_vocabs = 0;
  let absolute_max_vocabs = 0;
  let custom_learnahead = 200;
  let decks_with_coverage = decks.map((deck) => {
    let lc_custom = learnAheadCoverage(deck.vocabs, custom_learnahead);
    return {
      ...deck,
      lc_50: learnAheadCoverage(deck.vocabs, 50),
      lc_100: learnAheadCoverage(deck.vocabs, 100),
      lc_custom: lc_custom,
      cliff: lc_custom - deck.learning_coverage,
    };
  });
  console.log(`[${Date.now() - startTime}] Done with coverage prediction`);
  let handler = new DataHandler(decks_with_coverage);
  let rows = handler.getRows();
  handler.sortDesc("learning_coverage");

  $: if (custom_learnahead >= 0) {
    console.log("recomputing custom learnahead coverage");
    decks_with_coverage = decks.map((deck) => {
      let lc_custom = learnAheadCoverage(deck.vocabs, custom_learnahead);
      return {
        ...deck,
        lc_50: learnAheadCoverage(deck.vocabs, 50),
        lc_100: learnAheadCoverage(deck.vocabs, 100),
        lc_custom: lc_custom,
        cliff: lc_custom - deck.learning_coverage,
      };
    });
    handler = new DataHandler(decks_with_coverage);
    rows = handler.getRows();
    handler.sortDesc("lc_custom");
    handler.filter(min_coverage, "lc_custom", (a, b) => a > b);
    absolute_min_words = decks_with_coverage
      .map((it) => it.word_count)
      .reduce((acc, curr) => Math.min(acc, curr));
    absolute_max_words = decks_with_coverage
      .map((it) => it.word_count)
      .reduce((acc, curr) => Math.max(acc, curr));
    absolute_min_vocabs = decks_with_coverage
      .map((it) => it.vocab_count)
      .reduce((acc, curr) => Math.min(acc, curr));
    absolute_max_vocabs = decks_with_coverage
      .map((it) => it.vocab_count)
      .reduce((acc, curr) => Math.max(acc, curr));
  }
</script>

<br />
<br />
Custom learnahead:
<input bind:value={custom_learnahead} type="number" step="50" />

<CoExplanation {custom_learnahead} />

<table>
  <thead>
    <tr>
      <Th {handler} orderBy="name">Name</Th>
      <Th {handler} orderBy="vocab_count">Vocab</Th>
      <Th {handler} orderBy="word_count">Words</Th>
      <Th {handler} orderBy="known_coverage">Coverage</Th>
      <Th {handler} orderBy="learning_coverage">
        Learning
        <br />
        Coverage
      </Th>
      <Th {handler} orderBy="lc_50">LC + 50</Th>
      <Th {handler} orderBy="lc_100">LC + 100</Th>
      <Th {handler} orderBy="lc_custom">LC + {custom_learnahead}</Th>
      <Th {handler} orderBy="cliff">Cliff</Th>
    </tr>
    <tr>
      <ThFilter {handler} filterBy="name" />
      <ThFilterMinMax
        {handler}
        filterBy="vocab_count"
        min={absolute_min_vocabs}
        max={absolute_max_vocabs}
      />
      <ThFilterMinMax
        {handler}
        filterBy="word_count"
        min={absolute_min_words}
        max={absolute_max_words}
      />
      <ThFilterMinMax {handler} filterBy="known_coverage" />
      <ThFilterMinMax {handler} filterBy="learning_coverage" />
      <ThFilterMinMax {handler} filterBy="lc_50" />
      <ThFilterMinMax {handler} filterBy="lc_100" />
      <ThFilterMinMax {handler} filterBy="lc_custom" />
      <ThFilterMinMax {handler} filterBy="cliff" />
    </tr>
  </thead>
  <tbody>
    {#each $rows as row}
      <tr>
        <td>{row.name}</td>
        <td>{row.vocab_count}</td>
        <td>{row.word_count}</td>
        <td>{row.known_coverage.toFixed(2)}</td>
        <td>{row.learning_coverage.toFixed(2)}</td>
        <td>{row.lc_50.toFixed(2)}</td>
        <td>{row.lc_100.toFixed(2)}</td>
        <td>{row.lc_custom.toFixed(2)}</td>
        <td>{row.cliff.toFixed(2)}</td>
      </tr>
    {/each}
  </tbody>
</table>

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
