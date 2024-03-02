<script lang="ts">
  import type { DataHandler } from "@vincjo/datatables";
  export let handler: DataHandler;
  export let filterBy: string = "";
  let value = "";

  async function updateFilter() {
    handler.filter(value, filterBy);
  }

  // set filter again if handler changes
  $: if (handler) updateFilter();
</script>

<th>
  <input type="text" placeholder="Filter" bind:value on:input={updateFilter} />
</th>

<style>
  input {
    max-width: 600px;
    height: 24px;
    border: none;
    border-bottom: 1px solid #e0e0e0;
    background: inherit;
    outline: none;
    border-radius: 0;
    font-size: 14px;
  }
  input::placeholder {
    color: #bdbdbd;
    font-style: italic;
    font-size: 13px;
  }
  input:focus {
    outline: 1px solid #bdbdbd;
  }
</style>
