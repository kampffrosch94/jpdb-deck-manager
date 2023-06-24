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

<table>
    <tr>
        <th>name</th>
        <th>coverage</th>
        <th>learning coverage</th>
        <th>is_built_in</th>
    </tr>
    {#each decks as deck}
        {#if deck.known_coverage > min_coverage && deck.learning_coverage > min_learning && (deck.is_built_in || !filter_builtin)}
            <tr>
                <td>
                    {deck.name}
                    <a href="https://jpdb.io/deck?id={deck.id}">[x]</a>
                </td>
                <td>{deck.known_coverage.toFixed(1)}</td>
                <td>{deck.learning_coverage.toFixed(1)}</td>
                <td>{deck.is_built_in}</td>
            </tr>
        {/if}
    {/each}
</table>

<style>
    td:first-child {
        width: 400px;
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
</style>
