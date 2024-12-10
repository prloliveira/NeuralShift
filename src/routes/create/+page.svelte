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

<main class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <h1 class="text-2xl font-bold mb-6">Upload HTML and JSON Files</h1>
  <form on:submit|preventDefault="{handleUpload}" class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
    <div class="mb-4">
      <label for="htmlFile" class="block text-gray-700 text-sm font-bold mb-2">HTML File</label>
      <input id="htmlFile" type="file" accept=".html" on:change="{(e) => { const target = e.target as HTMLInputElement; if (target.files) htmlFile = target.files[0]; }}" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
    <div class="mb-4">
      <label for="jsonFile" class="block text-gray-700 text-sm font-bold mb-2">JSON File</label>
      <input id="jsonFile" type="file" accept=".json" on:change="{(e) => { const target = e.target as HTMLInputElement; if (target.files) jsonFile = target.files[0]; }}" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
    <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Upload</button>
  </form>
</main>
