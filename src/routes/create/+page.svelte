<script lang="ts">
  import { onMount } from 'svelte';
  import { courtRulings, caseDetails, lawReferences } from '$lib/server/db/schema';
  import { db } from '$lib/server/db';

  let htmlFile: File | null = null;
  let jsonFile: File | null = null;

  async function handleUpload() {
    if (!htmlFile || !jsonFile) {
      alert('Please upload both HTML and JSON files.');
      return;
    }

    const htmlContent = await htmlFile.text();
    const jsonContent = await jsonFile.text();
    const jsonData = JSON.parse(jsonContent);

    // Extract data from HTML and JSON
    const processNumber = extractProcessNumber(htmlContent);
    const caseDescription = extractCaseDescription(htmlContent);
    const lawEntities = jsonData.entities.filter((entity: any) => entity.label === 'LAW');

    // Insert data into the database
    const caseDetailsId = await db.insert(caseDetails).values({ description: caseDescription }).returning('id');
    const courtRulingId = await db.insert(courtRulings).values({
      processNumber,
      judgeRapporteur: 1, // Example value, replace with actual data
      court: 1, // Example value, replace with actual data
      decision: 1, // Example value, replace with actual data
      date: new Date(),
      caseDetailsId: caseDetailsId[0].id
    }).returning('id');

    for (const law of lawEntities) {
      await db.insert(lawReferences).values({
        name: law.name,
        url: law.url,
        courtRulingId: courtRulingId[0].id
      });
    }

    alert('Files uploaded and data stored successfully.');
  }

  function extractProcessNumber(htmlContent: string): string {
    // Implement logic to extract process number from HTML content
    return '1059/13.6TTCBR.C1.S1'; // Example value, replace with actual extraction logic
  }

  function extractCaseDescription(htmlContent: string): string {
    // Implement logic to extract case description from HTML content
    return 'Example case description'; // Example value, replace with actual extraction logic
  }
</script>

<main>
  <h1>Upload HTML and JSON Files</h1>
  <input type="file" accept=".html" on:change="{(e) => htmlFile = e.target.files[0]}" />
  <input type="file" accept=".json" on:change="{(e) => jsonFile = e.target.files[0]}" />
  <button on:click="{handleUpload}">Upload</button>
</main>
