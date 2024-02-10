<script lang="ts">
    import { selected_decks, token } from "../state/stores";
    import { fetchDeckVocab, isKnownWord, learnAheadCoverage, lookupVocab } from "../util/jpdb_api";

    let deck: DeckWithVocab | undefined;
    $: {
        if ($selected_decks.length > 0) {
            let newDeck = $selected_decks[$selected_decks.length - 1];
            updateDeck(newDeck);
        }
    }

    let learnahead: [number, number][] = [];
    let max_learnable: number = 0;

    async function updateDeck(newDeck: Deck) {
        const fetched = await fetchDeckVocab($token, newDeck);
        let vocab = await lookupVocab($token, fetched.vocabs);
        let learnahead_tmp: [number, number][] = [];
        let attempts = [
            50, 100, 200, 400, 600, 800, 1000, 1500, 2000, 4000, 6000, 8000,
            10000, 20000, 100000,
        ];

        let considered = vocab.filter((v) => "blacklisted" != v.state[0]);
        max_learnable = considered.filter((w) => !isKnownWord(w)).length;
        //console.log( "" + considered.length + " - " + considered.filter(isKnownWord).length + " = " + max_learnable,);
        for (let attempt of attempts) {
            let n = Math.min(attempt, max_learnable);
            let coverage = learnAheadCoverage(vocab, n);
            learnahead_tmp.push([n, coverage]);
            if (n >= max_learnable) {
                break;
            }
        }
        learnahead = learnahead_tmp;
        deck = fetched;
    }

</script>

<div>
    <h3>Deck coverage prediction for a single deck</h3>
    <p>
        This tool predicts how coverage for a deck will change if you learned
        new vocab in local frequency order.
    </p>
    <p>It considers new, locked and suspended cards as learnable.</p>
    <p>Select a deck from the deck list to the left.</p>

    {#if deck !== undefined}
        <table>
            <tr>
                <td>Deck name </td>
                <td>{deck?.name}</td>
            </tr>
            <tr>
                <td>WordCount </td>
                <td>{deck?.word_count}</td>
            </tr>
            <tr>
                <td>known coverage </td>
                <td>{deck?.known_coverage.toFixed(2)}</td>
            </tr>
            <tr>
                <td>learning coverage </td>
                <td>{deck?.learning_coverage.toFixed(2)}</td>
            </tr>
            {#each learnahead as it}
                <tr>
                    <td>learning coverage with {it[0]} extra learned</td>
                    <td>{it[1].toFixed(2)} </td>
                </tr>
            {/each}
        </table>
    {/if}
</div>

<style>
    table tr td:nth-child(2n) {
        background-color: #ffffff;
        max-width: 500px;
    }
    table tr {
        background-color: #e7e9eb;
    }
    table {
        border: 1px solid #000000;
    }
</style>
