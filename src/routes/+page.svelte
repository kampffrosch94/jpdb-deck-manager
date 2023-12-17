<script lang="ts">
    interface Deck {
        name: string;
        id: number;
        known_coverage: number;
        learning_coverage: number;
        is_built_in: boolean;
        word_count: number;
        vocab_count: number;
    }

    interface Vocab {
        vid: number;
        sid: number;
        occurences: number;
    }

    // lifted from the breader, :ikneel:
    type CardState = string[] &
        (
            | [
                  | "new"
                  | "learning"
                  | "known"
                  | "never-forget"
                  | "due"
                  | "failed"
                  | "suspended"
                  | "blacklisted"
              ]
            | [
                  "redundant",
                  (
                      | "learning"
                      | "known"
                      | "never-forget"
                      | "due"
                      | "failed"
                      | "suspended"
                  )
              ]
            | ["locked", "new" | "due" | "failed"]
            | ["redundant", "locked"] // Weird outlier, might either be due or failed
            | ["not-in-deck"]
        );

    interface VocabWithState extends Vocab {
        state: CardState;
        frequency: number;
    }

    interface DeckWithVocab extends Deck {
        vocabs: Vocab[];
    }

    enum UnificationStrategy {
        Merge,
        Intersect,
        BijakMerge,
    }

    enum SortColumn {
        Name,
        Coverage,
        Learning,
        WordCount,
        VocabCount,
    }

    // top part
    let token: string = "";
    let result: string = "";
    // deck manager
    let decks: Deck[] = [];
    let deckSortColumn: SortColumn = SortColumn.Name;
    $: shown_decks = decks
        .filter(
            (deck) =>
                deck.known_coverage >= min_coverage &&
                deck.learning_coverage >= min_learning &&
                (deck.is_built_in || !filter_builtin)
        )
        .sort((a: Deck, b: Deck) => {
            switch (deckSortColumn) {
                case SortColumn.Name:
                    return a.name.localeCompare(b.name);
                case SortColumn.Coverage:
                    return b.known_coverage - a.known_coverage;
                case SortColumn.Learning:
                    return b.learning_coverage - a.learning_coverage;
                case SortColumn.WordCount:
                    return b.word_count - a.word_count;
                case SortColumn.VocabCount:
                    return b.vocab_count - a.vocab_count;
            }
        });
    let min_coverage = 0;
    let min_learning = 0;
    let filter_builtin = false;

    // deck merger
    let selected_decks: Deck[] = [];
    let new_deck_name = "";
    let min_occurences = 1;
    let min_decks = 1;
    let strat: UnificationStrategy = UnificationStrategy.Merge;
    let last_created_deck: { name: string; id: number } | null = null;

    // state filter
    let state_filter_enabled = false;
    let state_filter_option = [
        "new",
        "locked",
        "learning",
        "known",
        "due",
        "failed",
        "never-forget",
        "suspended",
        "blacklisted",
    ];
    let state_filter = state_filter_option[0];

    // frequency filter
    let frequency_filter_enabled = false;
    let frequency_filter_min = 1;
    let frequency_filter_max = 30000;

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
        if (result == "{}") {
            result = "Token confirmed as correct.";
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
                "vocabulary_count"
            ],
        };
        const json = await (
            await jpdbRequest("list-user-decks", fields)
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

    async function lookupVocab(vocabs: Vocab[]): Promise<VocabWithState[]> {
        const ids = vocabs.map((it) => [it.vid, it.sid]);
        const json = await (
            await jpdbRequest("lookup-vocabulary", {
                list: ids,
                fields: ["card_state", "frequency_rank"],
            })
        ).json();
        let r = [];
        for (let i = 0; i < json.vocabulary_info.length; i++) {
            r.push({
                state: json.vocabulary_info[i][0],
                frequency: json.vocabulary_info[i][1],
                ...vocabs[i],
            });
        }
        return r;
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

    function merge_vocab(vocabss: Vocab[][], min_decks: number): Vocab[] {
        interface VocabWithDeckCount extends Vocab {
            decks: number;
        }
        const merged: VocabWithDeckCount[] = [];
        for (const vocabs of vocabss) {
            for (const vocab of vocabs) {
                const el = merged.find(
                    (it) => it.vid === vocab.vid && it.sid === vocab.sid
                );
                if (el != null) {
                    el.occurences += vocab.occurences;
                    el.decks += 1;
                } else {
                    merged.push({ decks: 1, ...vocab });
                }
            }
        }
        return merged.filter((it) => it.decks >= min_decks);
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
        <h3>Decklist (showing {shown_decks.length} of {decks.length})</h3>
        <table>
            <tr>
                <th on:click={(_) => (deckSortColumn = SortColumn.Name)}>
                    <i
                        class={deckSortColumn == SortColumn.Name
                            ? "sorting_asc"
                            : "sorting"}
                    />
                    name</th
                >
                <th on:click={(_) => (deckSortColumn = SortColumn.Coverage)}>
                    <i
                        class={deckSortColumn == SortColumn.Coverage
                            ? "sorting_desc"
                            : "sorting"}
                    />
                    coverage</th
                >
                <th on:click={(_) => (deckSortColumn = SortColumn.Learning)}>
                    <i
                        class={deckSortColumn == SortColumn.Learning
                            ? "sorting_desc"
                            : "sorting"}
                    />
                    learning<br/>coverage</th
                >
                <th on:click={(_) => (deckSortColumn = SortColumn.VocabCount)}>
                    <i
                        class={deckSortColumn == SortColumn.VocabCount
                            ? "sorting_desc"
                            : "sorting"}
                    />
                    vocab</th
                >
                <th on:click={(_) => (deckSortColumn = SortColumn.WordCount)}>
                    <i
                        class={deckSortColumn == SortColumn.WordCount
                            ? "sorting_desc"
                            : "sorting"}
                    />
                    words</th
                >
                <th>is_built_in</th>
            </tr>
            {#each shown_decks as deck}
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
                        <a target="_blank" href="https://jpdb.io/deck?id={deck.id}">[jpdb]</a>
                    </td>
                    <td style="text-align: right;">{deck.known_coverage.toFixed(1)}</td>
                    <td style="text-align: right;">{deck.learning_coverage.toFixed(1)}</td>
                    <td style="text-align: right;">{deck.vocab_count}</td>
                    <td style="text-align: right;">{deck.word_count}</td>
                    <td style="text-align: center;">{deck.is_built_in}</td>
                </tr>
            {/each}
        </table>
        {#if decks.length > 0}
            <button
                on:click={async () => {
                    // update for svelte needs assignment
                    selected_decks = selected_decks.concat(shown_decks);
                }}>add all</button
            >
        {/if}
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

        <p>
            min occurences:
            <input bind:value={min_occurences} type="number" />
        </p>

        <p>
            <label
                title={"Merges decks into new deck, adds up all vocab occurences, then removes all vocab where occurences < min_occurences"}
            >
                <input
                    type="radio"
                    bind:group={strat}
                    name="strat"
                    value={UnificationStrategy.Merge}
                />
                Merge
            </label>

            <label
                title={"Only adds those words into the new deck that appear in all decks. Then removes all where occurences < min_occurences"}
            >
                <input
                    type="radio"
                    bind:group={strat}
                    name="strat"
                    value={UnificationStrategy.Intersect}
                />
                Intersect
            </label>

            <label
                title={"The BijakMerge (named after its inventor) works just like the regular merge, \
but also needs a minimum number of decks for a word to appear in for it to be included."}
            >
                <input
                    type="radio"
                    bind:group={strat}
                    name="strat"
                    value={UnificationStrategy.BijakMerge}
                />
                BijakMerge
            </label>
        </p>
        {#if strat == UnificationStrategy.BijakMerge}
            <p>
                min decks:
                <input bind:value={min_decks} type="number" />
            </p>
        {/if}

        <p>
            Filter for card state?
            <input type="checkbox" bind:checked={state_filter_enabled} />
            {#if state_filter_enabled}
                <select bind:value={state_filter}>
                    {#each state_filter_option as option}
                        <option value={option}>
                            {option}
                        </option>
                    {/each}
                </select>
            {/if}
        </p>
        <p>
            Filter by global frequency?
            <input type="checkbox" bind:checked={frequency_filter_enabled} />
            {#if frequency_filter_enabled}
                <p>
                    min: <input
                        bind:value={frequency_filter_min}
                        type="number"
                    />
                </p>
                <p>
                    max: <input
                        bind:value={frequency_filter_max}
                        type="number"
                    />
                </p>
            {/if}
        </p>
        <button
            disabled={selected_decks.length <= 0}
            on:click={async () => {
                if (new_deck_name !== "") {
                    last_created_deck = null;
                    const vocabss = [];
                    for (const deck of selected_decks) {
                        const deck_with_vocab = await fetchDeckVocab(deck);
                        vocabss.push(deck_with_vocab.vocabs);
                    }
                    let vocabs;
                    switch (strat) {
                        case UnificationStrategy.Merge:
                            vocabs = merge_vocab(vocabss, 1);
                            break;
                        case UnificationStrategy.Intersect:
                            vocabs = merge_vocab(vocabss, vocabss.length);
                            break;
                        case UnificationStrategy.BijakMerge:
                            vocabs = merge_vocab(vocabss, min_decks);
                            break;
                    }
                    vocabs = vocabs.filter(
                        (it) => it.occurences >= min_occurences
                    );
                    if (state_filter_enabled || frequency_filter_enabled) {
                        vocabs = await lookupVocab(vocabs);
                        if (state_filter_enabled) {
                            vocabs = vocabs.filter(
                                (it) => it.state[0] === state_filter
                            );
                        }
                        if (frequency_filter_enabled) {
                            vocabs = vocabs.filter(
                                (it) =>
                                    frequency_filter_min <= it.frequency &&
                                    it.frequency <= frequency_filter_max
                            );
                        }
                    }
                    const deck_id = await createNewDeck(new_deck_name);
                    await addVocabToDeck(deck_id, vocabs);
                    last_created_deck = { id: deck_id, name: new_deck_name };
                }
            }}>create deck</button
        >
        {#if last_created_deck != null}
            <p>
                Last created:
                {last_created_deck.name}
                <a target="_blank" href="https://jpdb.io/deck?id={last_created_deck.id}"
                    >[jpdb]</a
                >
            </p>
        {/if}
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

    /* https://stackoverflow.com/a/22156412 */
    .sorting,
    .sorting_asc,
    .sorting_desc {
        padding: 4px 21px 4px 4px;
        cursor: pointer;
    }
    .sorting {
        background: url(data:image/gif;base64,R0lGODlhCwALAJEAAAAAAP///xUVFf///yH5BAEAAAMALAAAAAALAAsAAAIUnC2nKLnT4or00PvyrQwrPzUZshQAOw==)
            no-repeat center right;
    }
    .sorting_asc {
        background: url(data:image/gif;base64,R0lGODlhCwALAJEAAAAAAP///xUVFf///yH5BAEAAAMALAAAAAALAAsAAAIRnC2nKLnT4or00Puy3rx7VQAAOw==)
            no-repeat center right;
    }
    .sorting_desc {
        background: url(data:image/gif;base64,R0lGODlhCwALAJEAAAAAAP///xUVFf///yH5BAEAAAMALAAAAAALAAsAAAIPnI+py+0/hJzz0IruwjsVADs=)
            no-repeat center right;
    }
</style>
