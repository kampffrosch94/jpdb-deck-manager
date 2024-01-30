<script lang="ts">
    import DeckList from "./DeckList.svelte";
    import "../util/jpdb_api";
    import { jpdbRequest } from "../util/jpdb_api";
    import { logged_in, result, selected_decks, token } from "../state/stores";
    import DeckMerger from "./DeckMerger.svelte";
    import Login from "./Login.svelte";

    let decks: Deck[] = [];

    // deck list
    let min_coverage = 0;
    let min_learning = 0;
    let filter_builtin = false;

    async function fetchDecks() {
        let fields = {
            fields: [
                "name",
                "vocabulary_known_coverage",
                "vocabulary_in_progress_coverage",
                "is_built_in",
                "id",
                "word_count",
                "vocabulary_count",
            ],
        };
        const json = await (
            await jpdbRequest("list-user-decks", fields, $token)
        ).json();
        decks = json.decks.map(
            (it: [string, number, number, boolean, number, number, number]) => {
                let [
                    name,
                    known_coverage,
                    learning_coverage,
                    is_built_in,
                    id,
                    word_count,
                    vocab_count,
                ] = it;
                return {
                    name: name,
                    id: id,
                    known_coverage: known_coverage ?? 0,
                    learning_coverage: learning_coverage ?? 0,
                    is_built_in: is_built_in,
                    word_count: word_count,
                    vocab_count: vocab_count,
                };
            },
        );
    }
</script>

{#if !$logged_in}
    <Login />
{:else}
    <p>Result:</p>
    <pre>{$result}</pre>
    <button type="button" on:click={fetchDecks}>Fetch user decks</button>

    <div class="container">
        <DeckList {decks} {min_coverage} {min_learning} {filter_builtin} />
        <DeckMerger />
    </div>
{/if}

<style>
    .container {
        display: flex;
        gap: 50px;
    }
</style>
