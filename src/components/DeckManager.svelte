<script lang="ts">
    import DeckList from "./DeckList.svelte";
    import "../util/jpdb_api";
    import { jpdbRequest } from "../util/jpdb_api";
    import { result, selected_decks, token } from "../state/stores";
    import DeckMerger from "./DeckMerger.svelte";

    let decks: Deck[] = [];

    // deck list
    let min_coverage = 0;
    let min_learning = 0;
    let filter_builtin = false;

    async function doPing() {
        const res = await jpdbRequest("ping", {}, $token);
        const json = await res.json();
        $result = JSON.stringify(json);
        if ($result == "{}") {
            $result = "Token confirmed as correct.";
        }
    }

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
        decks.sort((a: Deck, b: Deck) => a.name.localeCompare(b.name)); // sort by name
    }

</script>

<p>
    Put your API Token here (from the bottom of <a
        href="https://jpdb.io/settings">jpdb.io/settings</a
    >), it won't get sent anywhere except jpdb.io. Don't share it with anyone!
</p>
<p>After you have done this press fetch user decks.</p>
<p>
    You can enter the token in your browsers password manager if you don't want
    to input it every time you use this site.
</p>
<input bind:value={$token} type="password" />
<button type="button" on:click={doPing}>Ping</button>

<p>Result:</p>
<pre>
    {$result}
</pre>

<button type="button" on:click={fetchDecks}>Fetch user decks</button>

Min coverage:
<input bind:value={min_coverage} type="number" />
Min learning coverage:
<input bind:value={min_learning} type="number" />
Filter builtin:
<input bind:checked={filter_builtin} type="checkbox" />

<div class="container">
    <DeckList {decks} {min_coverage} {min_learning} {filter_builtin} />
    <DeckMerger />
</div>

<style>
    .container {
        display: flex;
        gap: 50px;
    }
</style>
