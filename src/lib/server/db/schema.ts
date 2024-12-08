import { pgTable, serial, varchar, text, date, integer } from "drizzle-orm/pg-core";

// Court rulings table
export const courtRulings = pgTable("court_rulings", {
	id: serial("id").primaryKey(),
	processNumber: varchar("process_number", { length: 255 }).notNull(),
	judgeRapporteur: integer("judge_rapporteur")
	  .notNull()
	  .references(() => judgeRapporteurs.id),
	court: integer("court")
	  .notNull()
	  .references(() => courts.id),
	decision: integer("decision")
	  .notNull()
	  .references(() => decisions.id),
	date: date("date").notNull(),
	summary: text("summary").notNull(),
});

// Judge rapporteurs table
export const judgeRapporteurs = pgTable("judge_rapporteurs", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
});

// Courts table
export const courts = pgTable("courts", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
});

// Decisions table
export const decisions = pgTable("decisions", {
	id: serial("id").primaryKey(),
	description: text("description").notNull(),
});

// Tags table
export const tags = pgTable("tags", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
});

// Junction table for many-to-many relationship
export const courtRulingsTags = pgTable("court_rulings_tags", {
	id: serial("id").primaryKey(),
	courtRulingId: integer("court_ruling_id")
	  .notNull()
	  .references(() => courtRulings.id),
	tagId: integer("tag_id")
	  .notNull()
	  .references(() => tags.id),
});


// Law references table
// JSON File with references to the laws
export const lawReferences = pgTable("law_references", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	url: varchar("url", { length: 255 }).notNull(),
	courtRulingId: integer("court_ruling_id")
	  .notNull()
	  .references(() => courtRulings.id),
	
});

