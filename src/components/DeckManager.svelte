<script lang="ts">
    import DeckList from "./DeckList.svelte";
    import "../util/jpdb_api";
    import { jpdbRequest } from "../util/jpdb_api";
    import { logged_in, result, selected_decks, token } from "../state/stores";
    import DeckMerger from "./DeckMerger.svelte";
    import DeckYeeter from "./DeckYeeter.svelte";
    import Login from "./Login.svelte";

    enum CurrentPage {
        DeckMerger,
        DeckYeeter,
    }
    let currentPage = CurrentPage.DeckMerger;

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
        let json = await (
            await jpdbRequest("list-user-decks", fields, $token)
        ).json();
        console.log(json);
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
    <Login on:login={fetchDecks}/>
{:else}
    <a
        href={"#"}
        on:click={(e) => {
            e.preventDefault();
            currentPage = CurrentPage.DeckMerger;
            $selected_decks = [];
        }}>DeckMerger</a
    >
    <a
        href={"#"}
        on:click={(e) => {
            e.preventDefault();
            currentPage = CurrentPage.DeckYeeter;
            $selected_decks = [];
        }}>DeckYeeter</a
    >
    <p>Result:</p>
    <pre>{$result}</pre>
    <button type="button" on:click={fetchDecks}>Fetch user decks</button>

    <div class="container">
        <DeckList {decks} {min_coverage} {min_learning} {filter_builtin} />
        {#if currentPage === CurrentPage.DeckMerger}
            <DeckMerger />
        {/if}
        {#if currentPage === CurrentPage.DeckYeeter}
            <DeckYeeter on:deleted_decks={fetchDecks} />
        {/if}
    </div>
{/if}

<style>
    .container {
        display: flex;
        gap: 50px;
    }
</style>
