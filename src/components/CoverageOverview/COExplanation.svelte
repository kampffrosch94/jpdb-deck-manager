<script lang="ts">
  export let custom_learnahead: number;
  let show = false;
</script>

<div>
  <button
    on:click={() => {
      show = !show;
    }}
  >
    {show ? "Hide" : "Show"} explanation
  </button>
  {#if show}
    <h3>Explanation:</h3>
    <p>
      <strong>LC + 50 etc</strong>
      : learning coverage if you learned 50 additional vocab in local frequency
      order
    </p>
    <p>
      <strong>Cliff</strong>
      = LC+{custom_learnahead} - learning coverge
      <br />
      The greater the cliff is the more that media will hammer in new vocab.
    </p>
    <p>
      <strong>Vocab</strong>
      : total vocab as shown in jpdb
    </p>
    <p>
      <strong>Words</strong>
      : words in deck, but not counting blacklisted words (api limitation; I'd
      rather have characters, but can't get that value)
    </p>
    <h4>How I use this:</h4>
    <p class="explanation">
      I look at what decks I can get to a high coverage with like ~200 extra
      words learned. Then I look at which of those have a reasonable character
      count, around 100k (~25k words with the counting method mentioned above)
      is what I can reasonable read in a week. Then I either pick one which
      speaks to me atm, or if there is nothing I pick one with a high "cliff"
      value, since that is good for enforcing new vocab while reading (and
      that's kinda the point of my reading challenge)
    </p>
  {/if}
</div>

<style>
  .explanation {
    max-width: 700px;
  }
</style>
