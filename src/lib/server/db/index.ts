import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import { courtRulings } from './schema'; // Import the table reference

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);

export async function getCourtRulings() {
  const result = await db.select().from(courtRulings); // Use the table reference
  return result;
}
