import { json } from '@sveltejs/kit';
import { getCourtRulings, getTagsForCourtRuling } from '$lib/server/db';

// GET /api/court-rulings
export async function GET() {
  try {
    const courtRulings = await getCourtRulings();

    return json(courtRulings);
  } catch (error) {
    console.error('Error fetching court rulings:', error);
    return json({ error: 'Failed to fetch court rulings' }, { status: 500 });
  }
}
