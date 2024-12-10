<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    let { ruling } = $props();

    onMount(async () => {
        const id = $page.params.id;
        const response = await fetch(`/api/court-rulings/${id}`);
        let data = await response.json();
        ruling = data
    });
</script>
{#if ruling}
<h1 class="text-2xl font-bold mb-4">Court Ruling Detail</h1>
<div class="bg-white p-4 border border-gray-200">
    <p><strong>Processo:</strong> {ruling.processNumber}</p>
    <p><strong>Relator:</strong> {ruling.judgeRapporteur}</p>
    <p><strong>Tribunal:</strong> {ruling.court}</p>
    <p><strong>Decisão:</strong> {ruling.decision}</p>
    <p><strong>Data:</strong> {ruling.date}</p>
    <p><strong>Descritores:</strong> {ruling.tags ? ruling.tags.join(', ') : ''}</p>
    <p><strong>Summary:</strong> {ruling.summary}</p>
    
</div>
{/if}