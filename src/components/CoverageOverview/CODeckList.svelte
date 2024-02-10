<script lang="ts">
    import { DataHandler } from "@vincjo/datatables";
    import Th from "../Th.svelte";
    import { learnAheadCoverage } from "../../util/jpdb_api";
    export let decks: DeckWithVocabState[];
    export let startTime: number;
    let decks_with_coverage = decks.map((deck) => {
        return { ...deck, 
            lc_50: learnAheadCoverage(deck.vocabs, 50),
            lc_100: learnAheadCoverage(deck.vocabs, 100),
            lc_custom: learnAheadCoverage(deck.vocabs, 200),
         };
    });
    console.log(`[${Date.now() - startTime}] Done with coverage prediction`)

    const handler = new DataHandler(decks_with_coverage);
    const rows = handler.getRows();
    handler.sortDesc("learning_coverage");
</script>

<table>
    <thead>
        <tr>
            <Th {handler} orderBy="name">Name</Th>
            <Th {handler} orderBy="vocab_count">vocab</Th>
            <Th {handler} orderBy="word_count">words</Th>
            <Th {handler} orderBy="known_coverage">Coverage</Th>
            <Th {handler} orderBy="learning_coverage">Learning<br />Coverage</Th
            >
            <Th {handler} orderBy="lc_50">LC + 50</Th>
            <Th {handler} orderBy="lc_100">LC + 100</Th>
            <Th {handler} orderBy="lc_custom">LC + custom</Th>
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
            </tr>
        {/each}
    </tbody>
</table>

<style>
    td:first-child {
        width: 400px;
        text-align: left;
    }
    table tr:nth-child(2n) {
        background-color: #e7e9eb;
    }
    table tr:nth-child(2n) {
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
</style>
