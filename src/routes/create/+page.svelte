<script lang="ts">

  let htmlFile: File | null = null;
  let jsonFile: File | null = null;

  async function handleUpload() {
    if (!htmlFile || !jsonFile) {
      alert('Please upload both HTML and JSON files.');
      return;
    }

    const formData = new FormData();
    formData.append('htmlFile', htmlFile);
    formData.append('jsonFile', jsonFile);

    const response = await fetch('/create', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      alert('Files uploaded and data stored successfully.');
    } else {
      alert(await response.text());
    }
  }
</script>

<main>
  <h1>Upload HTML and JSON Files</h1>
  <form on:submit|preventDefault="{handleUpload}">
    <input type="file" accept=".html" on:change="{(e) => { const target = e.target as HTMLInputElement; if (target.files) htmlFile = target.files[0]; }}" />
    <input type="file" accept=".json" on:change="{(e) => { const target = e.target as HTMLInputElement; if (target.files) jsonFile = target.files[0]; }}" />
    <button type="submit">Upload</button>
  </form>
</main>
