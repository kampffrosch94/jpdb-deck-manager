<script lang="ts">
    export let min_coverage: number;
    export let min_learning: number;
    export let filter_builtin: boolean;
    export let decks: Deck[];

    enum SortColumn {
        Name,
        Coverage,
        Learning,
        WordCount,
        VocabCount,
    }

    let selected_decks: Deck[] = []; // todo make store

    let deckSortColumn: SortColumn = SortColumn.Name;
    $: shown_decks = decks
        .filter(
            (deck) =>
                deck.known_coverage >= min_coverage &&
                deck.learning_coverage >= min_learning &&
                (deck.is_built_in || !filter_builtin),
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
</script>

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
                learning<br />coverage</th
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
                    <a target="_blank" href="https://jpdb.io/deck?id={deck.id}"
                        >[jpdb]</a
                    >
                </td>
                <td style="text-align: right;"
                    >{deck.known_coverage.toFixed(1)}</td
                >
                <td style="text-align: right;"
                    >{deck.learning_coverage.toFixed(1)}</td
                >
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
