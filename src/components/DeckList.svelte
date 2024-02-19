<script lang="ts">
  import { selected_decks } from "../state/stores";
  import { DataHandler } from "@vincjo/datatables";
  import Th from "./Th.svelte";
  import ThFilter from "./ThFilter.svelte";
  import ThFilterMinMax from "./ThFilterMinMax.svelte";

  let min_coverage: number = 0;
  let min_learning: number = 0;
  let filter_builtin: boolean = false;
  export let decks: Deck[];

  let handler = new DataHandler(decks);
  let rows = handler.getRows();
  let row_count = handler.getRowCount();

  // reset sort on refetch
  $: if (decks.length > 0) {
    handler = new DataHandler(decks);
    rows = handler.getRows();
    row_count = handler.getRowCount();
  }
</script>

<div>
  <h3>Decklist (showing {$row_count.total} of {decks.length})</h3>
  <table>
    <thead>
      <tr>
        <Th {handler} orderBy="name">deck name</Th>
        <Th {handler} orderBy="known_coverage">coverage</Th>
        <Th {handler} orderBy="learning_coverage">
          learning
          <br />
          coverage
        </Th>
        <Th {handler} orderBy="vocab_count">vocab</Th>
        <Th {handler} orderBy="word_count">words</Th>
        <Th {handler} orderBy="is_built_in">is_built_in</Th>
      </tr>
      <tr>
        <ThFilter {handler} filterBy="name" />
        <ThFilterMinMax {handler} filterBy="known_coverage" />
        <ThFilterMinMax {handler} filterBy="learning_coverage" />
        <ThFilterMinMax
          {handler}
          filterBy="vocab_count"
          max={decks
            .map((it) => it.vocab_count)
            .reduce((acc, curr) => Math.max(acc, curr), 0)}
        />
        <ThFilterMinMax
          {handler}
          filterBy="word_count"
          max={decks
            .map((it) => it.word_count)
            .reduce((acc, curr) => Math.max(acc, curr), 0)}
        />
        <th>
          <input
            bind:checked={filter_builtin}
            type="checkbox"
            on:input={() =>
              handler.filter(
                filter_builtin,
                "is_built_in",
                // @ts-ignore
                (a, b) => a || a !== b,
              )}
          />
        </th>
      </tr>
    </thead>
    <tbody>
      {#each $rows as deck}
        <tr>
          <td>
            <a
              href={"#"}
              on:click={(e) => {
                e.preventDefault();
                $selected_decks.push(deck);
                $selected_decks = $selected_decks; //update subscribers
              }}
            >
              {deck.name}
            </a>
            <a target="_blank" href="https://jpdb.io/deck?id={deck.id}">
              [jpdb]
            </a>
          </td>
          <td style="text-align: right;">{deck.known_coverage.toFixed(1)}</td>
          <td style="text-align: right;">
            {deck.learning_coverage.toFixed(1)}
          </td>
          <td style="text-align: right;">{deck.vocab_count}</td>
          <td style="text-align: right;">{deck.word_count}</td>
          <td style="text-align: center;">{deck.is_built_in}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  {#if decks.length > 0}
    <button
      on:click={async () => {
        $selected_decks = $selected_decks.concat($rows); //update subscribers
      }}
    >
      add all
    </button>
  {/if}
</div>

<style>
  td:first-child {
    width: 400px;
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
</style>
