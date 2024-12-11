<script>
    import { goto } from '$app/navigation';

    function goToList() {
        goto('/list');
    }

    function goToCreate() {
        goto('/create');
    }
</script>

<div class="container mx-auto p-4">
    <div class="flex justify-center space-x-4 mt-4">
        <button onclick={goToList} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go to List
        </button>
        <button onclick={goToCreate} class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Create New Ruling
        </button>
    </div>
</div>
