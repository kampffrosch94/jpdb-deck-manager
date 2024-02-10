<script lang="ts">
    import { DataHandler } from "@vincjo/datatables";
    import Th from "../Th.svelte";
    export let decks: Deck[];
    const handler = new DataHandler(decks);
    const rows = handler.getRows();
    handler.sortDesc('learning_coverage')
</script>

<table>
    <thead>
        <tr>
            <Th {handler} orderBy="name">Name</Th>
            <Th {handler} orderBy="vocab_count">vocab</Th>
            <Th {handler} orderBy="word_count">words</Th>
            <Th {handler} orderBy="known_coverage">Coverage</Th>
            <Th {handler} orderBy="learning_coverage">Learning<br/>Coverage</Th>
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
