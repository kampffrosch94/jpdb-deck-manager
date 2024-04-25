<script lang="ts">
  import type { DataHandler } from "@vincjo/datatables";
  export let handler: DataHandler;
  export let filterBy: string = "";
  export let min: number = 0;
  export let max = 100;
  export let step: number = 1;

  async function updateFilter() {
    handler.filter([min, max], filterBy, (a, b) => a >= b[0] && a <= b[1]);
  }

  $: if (handler) updateFilter();
</script>

<th>
  <input
    type="number"
    placeholder="min"
    bind:value={min}
    on:input={updateFilter}
    step={step}
  />
  <br />
  <input
    type="number"
    placeholder="max"
    bind:value={max}
    on:input={updateFilter}
    step={step}
  />
</th>

<style>
  input {
    border: none;
    border-bottom: 1px solid #e0e0e0;
    background: inherit;
    outline: none;
    border-radius: 0;
    max-width: 85px;
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
