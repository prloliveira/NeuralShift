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

    function goToCreate() {
        goto('/create');
    }
</script>

<h1 class="text-3xl font-bold mb-6 text-center text-gray-900">Court Rulings</h1>
<div class="flex justify-end mb-4">
    <button onclick={goToCreate} class="bg-green-500 text-white px-4 py-2 rounded">Create New Ruling</button>
</div>
<div class="overflow-x-auto">
    <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
        <thead class="bg-blue-100">
            <tr>
                <th class="py-3 px-6 border-b text-left text-blue-800">Processo</th>
                <th class="py-3 px-6 border-b text-left text-blue-800">Tribunal</th>
                <th class="py-3 px-6 border-b text-left text-blue-800">Sumário</th>
                <th class="py-3 px-6 border-b text-left text-blue-800">Descritores</th>
            </tr>
        </thead>
        <tbody>
            {#each courtRulings as ruling}
                <tr class="hover:bg-blue-100 cursor-pointer" onclick={() => goToDetail(ruling.id)}>
                    <td class="py-3 px-6 border-b text-blue-700">{ruling.processNumber}</td>
                    <td class="py-3 px-6 border-b text-blue-700">{ruling.court}</td>
                    <td class="py-3 px-6 border-b text-blue-700">{@html ruling.summary}</td>
                    <td class="py-3 px-6 border-b text-blue-700">{ruling.tags.map(tag => tag).join(', ')}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
