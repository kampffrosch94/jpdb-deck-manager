<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { logged_in, result, token } from "../state/stores";
  import { jpdbRequest } from "../util/jpdb_api";

  const dispatch = createEventDispatcher();

  async function doPing() {
    const res = await jpdbRequest("ping", {}, $token);
    const json = await res.json();
    $result = JSON.stringify(json);
    if ($result == "{}") {
      $result = "Token confirmed as correct.";
      $logged_in = true;
      dispatch("login");
    }
  }
</script>

<p>
  Put your API Token here (from the bottom of <a
    target="_blank"
    href="https://jpdb.io/settings"
  >
    jpdb.io/settings
  </a>
  ), it won't get sent anywhere except jpdb.io. Don't share it with anyone!
</p>
<p>
  You can enter the token in your browsers password manager if you don't want to
  input it every time you use this site.
</p>
<input bind:value={$token} type="password" />
<button type="button" on:click={doPing}>Confirm</button>
