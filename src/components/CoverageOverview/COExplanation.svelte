<script lang="ts">
    export let custom_learnahead: number;
    let show = false;
</script>

<div>
    <button
        on:click={() => {
            show = !show;
        }}>{show ? "Hide" : "Show"} explanation</button
    >
    {#if show}
        <p>Explanation:</p>
        <p>
            LC + 50 etc: learning coverage if you learned 50 additional vocab in
            local frequency order
        </p>
        <p>
            Cliff: LC+{custom_learnahead} - learning coverge <br />
            The greater the cliff is the more that media will hammer in new vocab.
        </p>
    {/if}
</div>

<style>
</style>
