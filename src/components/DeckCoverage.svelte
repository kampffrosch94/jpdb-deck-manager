<script lang="ts">
    import { selected_decks, token } from "../state/stores";
    import { fetchDeckVocab, lookupVocab } from "../util/jpdb_api";

    interface DeckWithCoveragePrediction extends DeckWithVocab {}

    let deck: DeckWithCoveragePrediction | null = null;
    $: {
        let newDeck = $selected_decks[$selected_decks.length - 1];
        updateDeck(newDeck);
    }

    let vocab: VocabWithState[] | null = null;

    async function updateDeck(newDeck: Deck) {
        const fetched = await fetchDeckVocab($token, newDeck);
        deck = fetched;
        vocab = await lookupVocab($token, deck.vocabs);
    }

    let wordcount = 0;
    let newish = 0;
    let considered = [];
    function computeCoverage(vocabs: VocabWithState[]): number {
        considered = vocabs.filter((v) => "blacklisted" != v.state[0]);
        let kinda_known = considered
            .filter(
                (v) =>
                    [
                        "known",
                        "never-forget",
                        "due",
                        "failed",
                        "redundant",
                        "learning",
                    ].includes(v.state[0]) ||
                    (v.state[0] === "locked" && v.state[1] !== "new"),
            )
            .reduce((acc, v) => acc + v.occurences, 0);
        let all = considered.reduce((acc, v) => acc + v.occurences, 0);
        wordcount = all;
        newish = considered.filter((v) =>
            ["new", "locked", "suspended"].includes(v.state[0]),
        ).length;
        return 100.0 * (kinda_known / all);
    }
</script>

<div>
    <h3>Deck coverage prediction for a single deck</h3>
    <p>
        This tool predicts how coverage for a deck will change if you learned
        new vocab in frequency order.
    </p>
    <p>It considers new, locked and suspended cards as learnable.</p>
    <p>Select a deck from the deck list to the left.</p>

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
            <td>{deck?.learning_coverage}</td>
        </tr>
        <tr>
            <td>computed coverage </td>
            <td>{vocab != null ? computeCoverage(vocab) : ""}</td>
        </tr>
        <tr>
            <td>computed wordcount </td>
            <td>{wordcount}</td>
        </tr>
        <tr>
            <td>learnable </td>
            <td>{newish}</td>
        </tr>
        <tr>
            <td>considered vocab count </td>
            <td>{considered.length}</td>
        </tr>
    </table>
</div>

<style>
    table tr td:nth-child(2n) {
        background-color: #ffffff;
    }
    table tr {
        background-color: #e7e9eb;
    }
    table {
        border: 1px solid #000000;
    }
</style>
