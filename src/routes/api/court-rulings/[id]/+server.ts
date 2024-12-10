import { json } from '@sveltejs/kit';
import { getCourtRulingById } from '$lib/server/db/index';

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
