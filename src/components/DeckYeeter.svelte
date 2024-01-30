<script lang="ts">
    import { jpdbRequest } from "../util/jpdb_api";
    import { result, selected_decks, token } from "../state/stores";
    import { createEventDispatcher } from "svelte";
    
    const dispatch = createEventDispatcher();

    async function deleteDeck(deck: Deck) {
        const json = await (
            await jpdbRequest(
                "deck/delete",
                {
                    id: deck.id,
                },
                $token,
            )
        ).json();
        $result = JSON.stringify(json);
    }
</script>

<div>
    <h3>DeckYeeter</h3>
    <p>Decks to delete:</p>
    {#each $selected_decks as deck}
        <p>{deck.name}</p>
    {/each}
    <button
        on:click={() => {
            $selected_decks = [];
        }}>Reset selection</button
    >
    <br />
    <br />
    <br />
    <button
        on:click={async () => {
            const result = confirm(
                "I'll delete " + $selected_decks.length + " decks. Is that ok?",
            );
            if (result) {
                // Add your action logic here
                for (const deck of $selected_decks) {
                    await deleteDeck(deck);
                }
                $selected_decks = [];
                dispatch("deleted_decks");
            }
        }}>Delete Decks!</button
    >
</div>
