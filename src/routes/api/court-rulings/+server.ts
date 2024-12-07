import { json } from '@sveltejs/kit';
import { getCourtRulings } from '$lib/server/db';

export async function GET() {
  try {
    const courtRulings = await getCourtRulings();
    return json(courtRulings);
  } catch (error) {
    console.error('Error fetching court rulings:', error);
    return json({ error: 'Failed to fetch court rulings' }, { status: 500 });
  }
}

