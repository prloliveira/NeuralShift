<script>
    import { onMount } from 'svelte';
    let courtRulings = $state();

  onMount(async () => {
    const response = await fetch('/api/court-rulings');
    courtRulings = await response.json();
  });
</script>

<h1>Court Rulings</h1>
<table>
	<thead>
		<tr>
			<th>ID</th>
			<th>Process Number</th>
			<th>Date</th>
		</tr>
	</thead>
	<tbody>
		{#each courtRulings as ruling}
			<tr>
				<td>{ruling.id}</td>
				<td>{ruling.processNumber}</td>
				<td>{ruling.date}</td>
			</tr>
		{/each}
	</tbody>
</table>
