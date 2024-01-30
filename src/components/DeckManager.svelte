<script lang="ts">
    import DeckList from "./DeckList.svelte";
    import "../util/jpdb_api";
    import { jpdbRequest } from "../util/jpdb_api";

    enum UnificationStrategy {
        Merge,
        Intersect,
        BijakMerge,
    }

    let decks: Deck[] = [];

    // top part
    let token: string = "";
    let result: string = "";
    
    // deck list
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


    async function doPing() {
        const res = await jpdbRequest("ping", {}, token);
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
            await jpdbRequest("list-user-decks", fields, token)
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
            }, token)
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
            }, token)
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
            }, token)
        ).json();
        result = JSON.stringify(json);
    }

    async function createNewDeck(name: String): Promise<number> {
        return (
            await (
                await jpdbRequest("deck/create-empty", { name: name }, token)
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
    <DeckList {decks} {min_coverage} {min_learning} {filter_builtin}/>
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
    .container {
        display: flex;
        gap: 50px;
    }
</style>
