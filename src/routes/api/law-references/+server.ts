import { getLawReferencesByCourtRulingId } from '$lib/server/db';

export async function GET({ url }) {
  const courtRulingId = url.searchParams.get('courtRulingId');
  if (!courtRulingId) {
    return new Response(JSON.stringify({ error: 'courtRulingId is required' }), { status: 400 });
  }

  const lawReferences = await getLawReferencesByCourtRulingId(Number(courtRulingId));
  return new Response(JSON.stringify(lawReferences), { status: 200 });
}