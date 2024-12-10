<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    export let ruling; // Declare ruling as a prop

    let fetchedRuling = ruling; // Separate variable for fetched data

    onMount(async () => {
        const id = $page.params.id;
        const response = await fetch(`/api/court-rulings/${id}`);
        const data = await response.json();
        fetchedRuling = data
        fetchedRuling.processText = data.processText.replace(/\r\n|\n/g, '<br>'); // Replace \n with <br>
    });
</script>

{#if fetchedRuling}
<h1 class="text-2xl font-bold mb-4">Court Ruling Detail</h1>
<div class="bg-white p-4 border border-gray-200">
    <p><strong>Processo:</strong> {fetchedRuling.processNumber}</p>
    <p><strong>Relator:</strong> {fetchedRuling.judgeRapporteur}</p>
    <p><strong>Tribunal:</strong> {fetchedRuling.court}</p>
    <p><strong>Decisão:</strong> {fetchedRuling.decision}</p>
    <p><strong>Data:</strong> {fetchedRuling.date}</p>
    
    <p><strong>Descritores:</strong> {fetchedRuling.tags ? fetchedRuling.tags.join(', ') : ''}</p>
    <p><strong>Summary:</strong> {fetchedRuling.summary}</p>

    <!-- Decode HTML entities if necessary -->
    <p><strong>Texto Principal:</strong> </p> 
    <div>{@html fetchedRuling.processText}</div>
</div>
{/if}
