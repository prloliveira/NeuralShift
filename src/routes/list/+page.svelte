<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    let {courtRulings} = $props();

    onMount(async () => {
        const response = await fetch('/api/court-rulings');
        let data = await response.json();
        courtRulings = data;
    });

    /**
	 * @param {any} id
	 */
    function goToDetail(id) {
        goto(`/detail/${id}`);
    }
</script>

<h1 class="text-2xl font-bold mb-4">Court Rulings</h1>
<table class="min-w-full bg-white border border-gray-200">
    <thead>
        <tr>
            <th class="py-2 px-4 border-b">Process Number</th>
            <th class="py-2 px-4 border-b">Court</th>
            <th class="py-2 px-4 border-b">Case Details</th>
            <th class="py-2 px-4 border-b">Tags</th>
        </tr>
    </thead>
    <tbody>
        {#each courtRulings as ruling}
            <tr class="hover:bg-gray-100 cursor-pointer" onclick={() => goToDetail(ruling.id)}>
                <td class="py-2 px-4 border-b">{ruling.processNumber}</td>
                <td class="py-2 px-4 border-b">{ruling.court}</td>
                <td class="py-2 px-4 border-b">{ruling.summary}</td>
                <td class="py-2 px-4 border-b">{ruling.tags.map(tag => tag).join(', ')}</td>
            </tr>
        {/each}
    </tbody>
</table>
