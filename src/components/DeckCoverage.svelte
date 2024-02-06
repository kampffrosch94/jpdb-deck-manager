<script lang="ts">
    import { selected_decks } from "../state/stores";

    let deck: Deck | null = null;
    $: deck = $selected_decks[$selected_decks.length - 1];
</script>

<div>
    <h3>Deck coverage prediction for a single deck</h3>
    <p>This tool predicts how coverage for a deck will change if you learned new vocab in frequency order.</p>
    <p>It considers new, locked and suspended cards as learnable.</p>

    <table>
        <tr>
            <td>Deck name: </td>
            <td>{deck?.name}</td>
        </tr>
        <tr>
            <td>WordCount: </td>
            <td>{deck?.word_count}</td>
        </tr>
        <tr>
            <td>Coverage: </td>
            <td>TODO</td>
        </tr>
    </table>
</div>

<style>
    table tr td:nth-child(2n){
        background-color: #ffffff;
    }
    table tr {
        background-color: #e7e9eb;
    }
    table {
        border: 1px solid #000000;
    }
</style>