import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import { courtRulings, courtRulingsTags, tags, courts } from './schema';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);

export async function getCourtRulings() {
  const courtRulingsResult = await db.select().from(courtRulings).leftJoin(courts, eq(courts.id, courtRulings.court)); // Use the table reference

  const courtRulingsWithTags = await Promise.all(courtRulingsResult.map(async (courtRuling) => {
    const tagsResult = await getTagsForCourtRuling(courtRuling.id);
    return {
      ...courtRuling,
      tags: tagsResult
    };
  }));

  return courtRulingsWithTags;
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