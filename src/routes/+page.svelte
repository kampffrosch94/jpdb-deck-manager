<script>
 let token = ''
 let result = null
 let decks = []
 let min_coverage = 0

 async function doPing () {
     let headers = new Headers();
     headers.set('Authorization', "Bearer " + token);
     headers.set('Content-Type', 'application/json');
		 const res = await fetch('https://jpdb.io/api/v1/ping', {
         headers: headers,
			   method: 'POST',
			   body: JSON.stringify({})
		 });

		 const json = await res.json();
		 result = JSON.stringify(json);
 }

 async function fetchDecks () {
     let headers = new Headers();
     headers.set('Authorization', "Bearer " + token);
     headers.set('Content-Type', 'application/json');
		 const res = await fetch('https://jpdb.io/api/v1/list-user-decks', {
         headers: headers,
			   method: 'POST',
			   body: JSON.stringify({
             fields: ["name", "vocabulary_known_coverage", "vocabulary_in_progress_coverage"]
         })
		 });

		 const json = await res.json();
		 result = JSON.stringify(json);
     decks = json.decks.filter(deck => deck[1] >= min_coverage);
 }
</script>


<input bind:value={token} type="password" />
<button type="button" on:click={doPing}>Ping</button>

<p>
	  Result:
</p>
<pre>
    {result}
</pre>


<button type="button" on:click={fetchDecks}>Fetch user decks</button>
Min coverage:
<input bind:value={min_coverage} type="number" />

{#each decks as deck}
    <pre>{deck[0]}
        Coverage: {deck[1]}</pre>
{/each}
