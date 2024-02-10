<script lang="ts">
    import { selected_decks } from "../state/stores";

    let min_coverage: number = 0;
    let min_learning: number = 0;
    let filter_builtin: boolean = false;
    export let decks: Deck[];

    enum SortColumn {
        None, // this is the deck order as it appears in jpdb
        Name,
        Coverage,
        Learning,
        WordCount,
        VocabCount,
    }
    
    let deckSortColumn: SortColumn = SortColumn.None;

    // reset sort on refetch
    $: if(decks.length > 0) {
        deckSortColumn = SortColumn.None;
    }

    // sort according to chosen method
    $: shown_decks = decks
        .filter(
            (deck) =>
                deck.known_coverage >= min_coverage &&
                deck.learning_coverage >= min_learning &&
                (deck.is_built_in || !filter_builtin),
        )
        .sort((a: Deck, b: Deck) => {
            switch (deckSortColumn) {
                case SortColumn.None:
                    return 0;
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
    Min coverage:
    <input bind:value={min_coverage} type="number" />
    Min learning coverage:
    <input bind:value={min_learning} type="number" />
    Filter builtin:
    <input bind:checked={filter_builtin} type="checkbox" />
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
                        on:click={(e) => {
                            e.preventDefault();
                            $selected_decks.push(deck);
                            $selected_decks = $selected_decks; //update subscribers
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
                $selected_decks.concat(shown_decks);
                $selected_decks = $selected_decks; //update subscribers
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
