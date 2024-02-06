<script lang="ts">
    import { result, selected_decks, token } from "../state/stores";
    import { jpdbRequest, fetchDeckVocab, lookupVocab } from "../util/jpdb_api";

    enum UnificationStrategy {
        Merge,
        Intersect,
        BijakMerge,
    }
    // deck merger
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
    

    async function addVocabToDeck(id: number, vocabs: Vocab[]) {
        let vocabulary: [number, number][] = [];
        let occurences: number[] = [];
        vocabs.forEach((vocab) => {
            vocabulary.push([vocab.vid, vocab.sid]);
            occurences.push(vocab.occurences);
        });
        const json = await (
            await jpdbRequest(
                "deck/add-vocabulary",
                {
                    id: id,
                    vocabulary: vocabulary,
                    occurences: occurences,
                },
                $token,
            )
        ).json();
        $result = JSON.stringify(json);
    }

    async function createNewDeck(name: String): Promise<number> {
        return (
            await (
                await jpdbRequest("deck/create-empty", { name: name }, $token)
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
                    (it) => it.vid === vocab.vid && it.sid === vocab.sid,
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
    <div id="deckmerger_div">
        <h3>Deckmerger</h3>
        selected decks:<br />
        {#each $selected_decks as deck}
            <p>{deck.name}</p>
        {/each}
        <button
            on:click={() => {
                $selected_decks = [];
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
            disabled={$selected_decks.length <= 0}
            on:click={async () => {
                if (new_deck_name !== "") {
                    last_created_deck = null;
                    const vocabss = [];
                    for (const deck of $selected_decks) {
                        const deck_with_vocab = await fetchDeckVocab($token, deck);
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
                        vocabs = await lookupVocab($token, vocabs);
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