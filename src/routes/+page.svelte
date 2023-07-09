<script lang="ts">
    interface Deck {
        name: string;
        id: number;
        known_coverage: number;
        learning_coverage: number;
        is_built_in: boolean;
    }

    interface Vocab {
        vid: number;
        sid: number;
        occurences: number;
    }

    interface DeckWithVocab extends Deck {
        vocabs: Vocab[];
    }

    let token: string = "";
    let result: string = "";
    let decks: Deck[] = [];
    let selected_decks: Deck[] = [];
    let min_coverage = 80;
    let min_learning = 80;
    let filter_builtin = false;
    let new_deck_name = "";

    async function jpdbRequest(url: string, body: object): Promise<Response> {
        let headers = new Headers();
        headers.set("Authorization", "Bearer " + token);
        headers.set("Content-Type", "application/json");
        return await fetch("https://jpdb.io/api/v1/" + url, {
            headers: headers,
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    async function doPing() {
        const res = await jpdbRequest("ping", {});
        const json = await res.json();
        result = JSON.stringify(json);
    }

    async function fetchDecks() {
        let fields = {
            fields: [
                "name",
                "vocabulary_known_coverage",
                "vocabulary_in_progress_coverage",
                "is_built_in",
                "id",
            ],
        };
        const json = await (
            await jpdbRequest("list-user-decks", fields)
        ).json();
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

    async function fetchDeckVocab(deck: Deck): Promise<DeckWithVocab> {
        const json = await (
            await jpdbRequest("deck/list-vocabulary", {
                id: deck.id,
                fetch_occurences: true,
            })
        ).json();
        let vocabs = [];
        for (let i = 0; i < json.vocabulary.length; i++) {
            let vocab: Vocab = {
                vid: json.vocabulary[i][0],
                sid: json.vocabulary[i][1],
                occurences: json.occurences[i],
            };
            vocabs.push(vocab);
        }
        return { vocabs: vocabs, ...deck };
    }

    async function addVocabToDeck(id: number, vocabs: Vocab[]) {
        let vocabulary: [number, number][] = [];
        let occurences: number[] = [];
        vocabs.forEach((vocab) => {
            vocabulary.push([vocab.vid, vocab.sid]);
            occurences.push(vocab.occurences);
        });
        const json = await (
            await jpdbRequest("deck/add-vocabulary", {
                id: id,
                vocabulary: vocabulary,
                occurences: occurences,
            })
        ).json();
        result = JSON.stringify(json);
    }

    async function createNewDeck(name: String): Promise<number> {
        return (
            await (
                await jpdbRequest("deck/create-empty", { name: name })
            ).json()
        ).id;
    }
</script>

<p>
    Put your API Token here (it won't get send anywhere except jpdb.io). Don't
    share it with anyone!
</p>
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

<div class="container">
    <div>
        <h3>Decklist</h3>
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
                            <a
                                href={"#"}
                                on:click={() => {
                                    selected_decks.push(deck);
                                    selected_decks = selected_decks;
                                }}
                                >{deck.name}
                            </a>
                            <a href="https://jpdb.io/deck?id={deck.id}"
                                >[jpdb]</a
                            >
                        </td>
                        <td>{deck.known_coverage.toFixed(1)}</td>
                        <td>{deck.learning_coverage.toFixed(1)}</td>
                        <td>{deck.is_built_in}</td>
                    </tr>
                {/if}
            {/each}
        </table>
    </div>
    <div id="deckmerger_div">
        <h3>Deckmerger</h3>
        selected decks:<br />
        {#each selected_decks as deck}
            <p>{deck.name}</p>
        {/each}
        <button
            on:click={() => {
                selected_decks = [];
            }}>Reset selection</button
        >
        <p>
            Name of new deck
            <input bind:value={new_deck_name} type="text" />
        </p>
        <button
            on:click={async () => {
                if (new_deck_name !== "") {
                    let deck_id = await createNewDeck(new_deck_name);
                    for (const deck of selected_decks) {
                        const deck_with_vocab = await fetchDeckVocab(deck);
                        await addVocabToDeck(deck_id, deck_with_vocab.vocabs);
                        console.log("Adding" + deck.name);
                    }
                }
            }}>create deck</button
        >
    </div>
</div>

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
    .container {
        display: flex;
        gap: 50px;
    }
</style>
