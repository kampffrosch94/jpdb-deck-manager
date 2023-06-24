<script lang="ts">
    interface Deck {
        name: string;
        id: number;
        known_coverage: number;
        learning_coverage: number;
        is_built_in: boolean;
    }

    let token: string = "";
    let result: string = "";
    let decks: Deck[] = [];
    let min_coverage = 80;
    let min_learning = 80;
    let filter_builtin = false;

    async function doPing() {
        let headers = new Headers();
        headers.set("Authorization", "Bearer " + token);
        headers.set("Content-Type", "application/json");
        const res = await fetch("https://jpdb.io/api/v1/ping", {
            headers: headers,
            method: "POST",
            body: JSON.stringify({}),
        });

        const json = await res.json();
        result = JSON.stringify(json);
    }

    async function fetchDecks() {
        let headers = new Headers();
        headers.set("Authorization", "Bearer " + token);
        headers.set("Content-Type", "application/json");
        const res = await fetch("https://jpdb.io/api/v1/list-user-decks", {
            headers: headers,
            method: "POST",
            body: JSON.stringify({
                fields: [
                    "name",
                    "vocabulary_known_coverage",
                    "vocabulary_in_progress_coverage",
                    "is_built_in",
                    "id",
                ],
            }),
        });

        const json = await res.json();
        result = JSON.stringify(json);
        decks = json.decks.map(
            (it: [string, number, number, boolean, number]) => {
                let [name, known_coverage, learning_coverage, is_built_in, id] =
                    it;
                return {
                    name: name,
                    id: id,
                    known_coverage: known_coverage,
                    learning_coverage: learning_coverage,
                    is_built_in: is_built_in,
                };
            }
        );
        decks.sort((a: Deck, b: Deck) => a.name.localeCompare(b.name)); // sort by name
    }
</script>

<input bind:value={token} type="password" />
<button type="button" on:click={doPing}>Ping</button>

<p>Result:</p>
<pre>
    {result}
</pre>

<button type="button" on:click={fetchDecks}>Fetch user decks</button>
Min coverage:
<input bind:value={min_coverage} type="number" />
Min learning coverage:
<input bind:value={min_learning} type="number" />
Filter builtin:
<input bind:checked={filter_builtin} type="checkbox" />

{#each decks as deck}
    {#if deck.known_coverage > min_coverage && deck.learning_coverage > min_learning && (deck.is_built_in || !filter_builtin)}
        <pre> {deck.name} <a href="https://jpdb.io/deck?id={deck.id}">[x]</a>
        Coverage: {deck.known_coverage}
        Learning Coverage: {deck.learning_coverage}
        Builtin: {deck.is_built_in}
        </pre>
    {/if}
{/each}
