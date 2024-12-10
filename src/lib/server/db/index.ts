import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import { courtRulings, courtRulingsTags, tags, courts, judgeRapporteurs, decisions, lawReferences } from './schema';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);

export async function getCourtRulings() {
  
  const courtRulingsResult = await db.select({
      id: courtRulings.id,
      processNumber: courtRulings.processNumber,
      judgeRapporteur: judgeRapporteurs.name,
      court: courts.name,
      decision: decisions.name,
      date: courtRulings.date,
      summary: courtRulings.summary
    })
    .from(courtRulings)
    .leftJoin(courts, eq(courts.id, courtRulings.court))
    .leftJoin(judgeRapporteurs, eq(judgeRapporteurs.id, courtRulings.judgeRapporteur))
    .leftJoin(decisions, eq(decisions.id, courtRulings.decision));

  const courtRulingsWithTags = await Promise.all(courtRulingsResult.map(async (courtRuling) => {
    const tagsResult = await getTagsForCourtRuling(courtRuling.id);
    return {
      ...courtRuling,
      tags: tagsResult
    };
  }));

  const encodedResult = courtRulingsWithTags.map(courtRuling => {
    return {
      ...courtRuling,
      summary: courtRuling.summary
    };
  });

  

  return encodedResult;
}

export async function getTagsForCourtRuling(courtRulingId: number) {
  const result = await db.select({
    tagName: tags.name,
  })
  .from(courtRulingsTags)
  .innerJoin(tags, eq(courtRulingsTags.tagId, tags.id))
  .where(eq(courtRulingsTags.courtRulingId, courtRulingId));

  return result.map(row => row.tagName);
}

export async function getCourtRulingById(id: number) {
  const courtRulingResult = await db.select({
      id: courtRulings.id,
      processNumber: courtRulings.processNumber,
      judgeRapporteur: judgeRapporteurs.name,
      court: courts.name,
      decision: decisions.name,
      date: courtRulings.date,
      summary: courtRulings.summary,
      processText: courtRulings.processText
  })
  .from(courtRulings)
  .leftJoin(courts, eq(courts.id, courtRulings.court))
  .leftJoin(judgeRapporteurs, eq(judgeRapporteurs.id, courtRulings.judgeRapporteur))
  .leftJoin(decisions, eq(decisions.id, courtRulings.decision))
  .where(eq(courtRulings.id, id))
  .limit(1);

  const courtRuling = courtRulingResult[0];
  const tagsResult = await getTagsForCourtRuling(courtRuling.id);

  return {
      ...courtRuling,
      tags: tagsResult
  };
}

export async function getLawReferencesByCourtRulingId(courtRulingId: number) {
  const result = await db.select({
    // Assuming lawReferences is a table in your schema
    id: lawReferences.id,
    name: lawReferences.name,
    url: lawReferences.url
  })
  .from(lawReferences)
  .where(eq(lawReferences.courtRulingId, courtRulingId));

  return result;
}