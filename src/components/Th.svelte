<script lang="ts">
  // see https://vincjo.fr/datatables/tutorial/sort-data
  import type { DataHandler } from "@vincjo/datatables";
  export let handler: DataHandler;
  export let orderBy: any = null;
  export let title: string | null = null;

  const identifier = orderBy?.toString();
  var sorted = handler.getSort();
  $: if (handler) {
    persistSort();
    // update to new handler
    sorted = handler.getSort();
  }

  function persistSort() {
    // resort new handler with old sort if necesary
    if ($sorted.identifier === identifier) {
      if ($sorted.direction === "asc") {
        handler.sort(orderBy);
      } else if ($sorted.direction === "desc") {
        handler.sort(orderBy);
        handler.sort(orderBy);
      }
    }
  }
</script>

<th
  on:click={() => handler.sort(orderBy)}
  class:active={$sorted.identifier === identifier}
  {title}
>
  <div class="flex">
    <strong>
      <slot />
    </strong>
    <span
      class:asc={$sorted.direction === "asc"}
      class:desc={$sorted.direction === "desc"}
    />
  </div>
</th>

<style>
  th {
    background: inherit;
    margin: 0;
    padding: 8px 20px;
    border-bottom: 1px solid #e0e0e0;
    user-select: none;
  }
  th {
    cursor: pointer;
  }
  th div.flex {
    padding: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
  }
  th span {
    padding-left: 8px;
  }
  th span:before,
  th span:after {
    border: 4px solid transparent;
    content: "";
    display: block;
    height: 0;
    width: 0;
  }
  th span:before {
    border-bottom-color: #e0e0e0;
    margin-top: 2px;
  }
  th span:after {
    border-top-color: #e0e0e0;
    margin-top: 2px;
  }
  th.active span.asc:before {
    border-bottom-color: #9e9e9e;
  }
  th.active span.desc:after {
    border-top-color: #9e9e9e;
  }
</style>
