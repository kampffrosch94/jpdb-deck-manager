<script lang="ts">
    import { DataHandler } from "@vincjo/datatables";
    import Th from "./Th.svelte";
    export let decks: Deck[];
    const handler = new DataHandler(decks, { rowsPerPage: 10 });
    const rows = handler.getRows();
</script>

<table>
    <thead>
        <tr>
            <Th {handler} orderBy="name">First name</Th>
            <Th {handler} orderBy="id">Last name</Th>
            <Th {handler} orderBy="is_built_in">Email</Th>
        </tr>
    </thead>
    <tbody>
        {#each $rows as row}
            <tr>
                <td>{row.name}</td>
                <td>{row.id}</td>
                <td>{row.is_built_in}</td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
    table {
        text-align: left;
        border-collapse: separate;
        border-spacing: 0;
        width: 100%;
    }
    td,
    th {
        padding: 4px 20px;
        border-bottom: 1px solid #eee;
    }
</style>
