import { defineConfig } from 'drizzle-kit';
if (!process.env.DATABASE_URL_LOCAL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',

	dbCredentials: {
		url: process.env.DATABASE_URL_LOCAL
	},
	out: "./drizzle",
	verbose: true,
	strict: true,
	dialect: 'postgresql'
});
