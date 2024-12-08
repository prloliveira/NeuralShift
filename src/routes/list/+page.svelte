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
            <th>Process Number</th>
            <th>Court</th>
            <th>Case Details</th>
            <th>Tags</th>
        </tr>
    </thead>
    <tbody>
        {#each courtRulings as ruling}
            <tr>
                <td>{ruling.processNumber}</td>
                <td>{ruling.court.name}</td>
                <td>{ruling.summary}</td>
                <td>{ruling.tags.map(tag => tag.name).join(', ')}</td>
            </tr>
        {/each}
    </tbody>
</table>
