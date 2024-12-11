<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    export let ruling; // Declare ruling as a prop

    let fetchedRuling = ruling; // Separate variable for fetched data
    let lawReferences = [];

    onMount(async () => {
        const id = $page.params.id;
        const response = await fetch(`/api/court-rulings/${id}`);
        const data = await response.json();
        fetchedRuling = data;

        const lawResponse = await fetch(`/api/law-references?courtRulingId=${id}`);
        lawReferences = await lawResponse.json();
        console.log(lawReferences);

        lawReferences.forEach(ref => {
            const escapedName = ref.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
            const regex = new RegExp(`(${escapedName.replace(/\s+/g, '\\s*')})`, 'gi'); // Match even if there are additional characters before or after
            fetchedRuling.processText = fetchedRuling.processText.replace(regex, match => `<a href="${ref.url}" style="color: blue; text-decoration: underline;">${match}</a>`);
        });

        fetchedRuling.processText = fetchedRuling.processText.replace(/\r|\n/g, '<br>'); // Replace \n with <br>
    });
</script>

{#if fetchedRuling}
<h1 class="text-3xl font-bold mb-6 text-center text-gray-900">Court Ruling Detail</h1>
<div class="bg-white p-8 border border-gray-300 rounded-lg shadow-lg space-y-6">
    <div class="p-6 bg-gray-100 rounded-lg shadow-sm">
        <p class="mb-3 text-gray-800"><strong>Processo:</strong> {fetchedRuling.processNumber}</p>
        <p class="mb-3 text-gray-800"><strong>Relator:</strong> {fetchedRuling.judgeRapporteur}</p>
        <p class="mb-3 text-gray-800"><strong>Tribunal:</strong> {fetchedRuling.court}</p>
        <p class="mb-3 text-gray-800"><strong>Decisão:</strong> {fetchedRuling.decision}</p>
        <p class="mb-3 text-gray-800"><strong>Data:</strong> {fetchedRuling.date}</p>
    </div>
    
    <div class="p-6 bg-gray-100 rounded-lg shadow-sm">
        <p class="mb-3 text-gray-800"><strong>Descritores:</strong> {fetchedRuling.tags ? fetchedRuling.tags.join(', ') : ''}</p>
        <p class="mb-3 text-gray-800"><strong>Sumário:</strong> {@html fetchedRuling.summary}</p>
    </div>

    <div class="p-6 bg-gray-100 rounded-lg shadow-sm">
        <p class="mb-3 text-gray-800"><strong>Texto Principal:</strong></p> 
        <div class="prose max-w-none text-gray-800">{@html fetchedRuling.processText}</div>
    </div>
</div>
{/if}
