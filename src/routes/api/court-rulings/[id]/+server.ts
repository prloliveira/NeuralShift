import { json } from '@sveltejs/kit';
import { getCourtRulingById, deleteCourtRulingById } from '$lib/server/db/index';

export async function GET({ params }) {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
        return json({ error: 'Invalid ID' }, { status: 400 });
    }

    const courtRuling = await getCourtRulingById(id);
    if (!courtRuling) {
        return json({ error: 'Court ruling not found' }, { status: 404 });
    }

    return json(courtRuling);
}

export async function DELETE({ params }) {
    const id = parseInt(params.id, 10);
    console.log(id);
    if (isNaN(id)) {
        return json({ error: 'Invalid ID' }, { status: 400 });
    }

    await deleteCourtRulingById(id);
    return json({ message: 'Court ruling deleted successfully' });
}
