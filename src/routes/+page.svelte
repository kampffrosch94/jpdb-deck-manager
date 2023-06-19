<script lang="ts">
    type Deck = [string, number, number, boolean]
    let token: String = ""
    let result: String = ""
    let decks: Deck[] = []
    let min_coverage = 80
    let min_learning = 80
    let filter_builtin = false

    async function doPing() {
        let headers = new Headers();
        headers.set('Authorization', "Bearer " + token);
        headers.set('Content-Type', 'application/json');
        const res = await fetch('https://jpdb.io/api/v1/ping', {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({})
        });

        const json = await res.json();
        result = JSON.stringify(json);
    }

    async function fetchDecks() {
        let headers = new Headers();
        headers.set('Authorization', "Bearer " + token);
        headers.set('Content-Type', 'application/json');
        const res = await fetch('https://jpdb.io/api/v1/list-user-decks', {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({
                fields: ["name", "vocabulary_known_coverage", "vocabulary_in_progress_coverage", "is_built_in"]
            })
        });

        const json: {decks: Deck[]} = await res.json();
        result = JSON.stringify(json);
        decks = json.decks;

    }

</script>


<input bind:value={token} type="password" />
<button type="button" on:click={doPing}>Ping</button>

<p>
    Result:
</p>
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
    {#if deck[1] > min_coverage && deck[2] > min_learning && (deck[3] || !filter_builtin)}
        <pre>{deck[0]}
        Coverage: {deck[1]}
        Learning Coverage: {deck[2]}
        Builtin: {deck[3]}
        </pre>
    {/if}
{/each}
