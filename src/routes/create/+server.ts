import { courtRulings, lawReferences, judgeRapporteurs, courts, decisions, tags, courtRulingsTags } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import iconv from 'iconv-lite';
import { eq } from "drizzle-orm";


export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();
  const htmlFile = formData.get('htmlFile') as File;
  const jsonFile = formData.get('jsonFile') as File;

  if (!htmlFile || !jsonFile) {
    return new Response('Please upload both HTML and JSON files.', { status: 400 });
  }

  const htmlContentBuffer = Buffer.from(await htmlFile.arrayBuffer());
  const htmlContent = iconv.decode(htmlContentBuffer, 'iso-8859-1');
  const jsonContent = await jsonFile.text();
  const jsonData = JSON.parse(jsonContent);

  if (!Array.isArray(jsonData)) {
    return new Response('Invalid JSON file format.', { status: 400 });
  }

  const processNumber = extractProcessNumber(htmlContent);
  const caseDescription = extractCaseDescription(htmlContent);
  const judgeRapporteur = extractJudgeRapporteur(htmlContent);
  const court = extractCourt(htmlContent);
  const decision = extractDecision(htmlContent);
  const decisionDate = extractDecisionDate(htmlContent);
  const lawEntities = jsonData;
  const tagsList = extractDescritores(htmlContent);
  const processText = extractProcessText(htmlContent);

  // Ensure valid foreign key references
  const judgeRapporteurId = await getOrCreate(judgeRapporteurs, { name: judgeRapporteur });
  const courtId = await getOrCreate(courts, { name: court });
  const decisionId = await getOrCreate(decisions, { name: decision });

  const courtRulingId = await db.insert(courtRulings).values({
    processNumber: processNumber,
    judgeRapporteur: judgeRapporteurId,
    court: courtId,
    decision: decisionId,
    date: decisionDate,
    summary: caseDescription,
    processText: processText,
  }).returning({ id: courtRulings.id });

  for (const tag of tagsList) {
    await db.insert(courtRulingsTags).values({
      tagId: await getOrCreate(tags, { name: tag }),
      courtRulingId: courtRulingId[0].id
    });
  }

  for (const law of lawEntities) {
    await db.insert(lawReferences).values({
      name: law.name,
      url: law.url,
      courtRulingId: courtRulingId[0].id
    });
  }

  return new Response('Files uploaded and data stored successfully.', { status: 200 });
};

async function getOrCreate(table: any, values: any): Promise<number> {
  const result = await db.select().from(table).where(eq(table.name, values.name)).execute();
  console.log(values);

  if (result.length > 0) {
    return result[0].id;
  }

  const insertResult = await db.insert(table).values(values).returning({ id: table.id }).execute();
  return insertResult[0].id;
}

function extractProcessNumber(htmlContent: string): string {
  const processNumberMatch = htmlContent.match(/<b><font[^>]*color="#000080"[^>]*>([^<]*)<br>/);
  return processNumberMatch ? processNumberMatch[1].trim() : 'Unknown';
}

function extractCaseDescription(htmlContent: string): string {
  const caseDescriptionMatch = htmlContent.match(/Sumário :<\/font><\/b><\/td><td[^>]*><b><font[^>]*>([\s\S]*?)<\/font><\/td><\/tr>/);
  return caseDescriptionMatch ? caseDescriptionMatch[1].replace(/<[^>]+>/g, '').trim() : 'No description available';
}

function extractJudgeRapporteur(htmlContent: string): string {
  const judgeRapporteurMatch = htmlContent.match(/Relator:<\/font><\/b><\/td><td[^>]*bgcolor="#E0F1FF"><b><font size="2"> <\/font><\/b><b><font size="2" color="#000080">([^<]*)<\/font><\/b><\/td><\/tr>/);
  return judgeRapporteurMatch ? judgeRapporteurMatch[1].trim() : 'Unknown';
}

function extractCourt(htmlContent: string): string {
  const courtMatch = htmlContent.match(/<title>([^<]*)<\/title>/);
  return courtMatch ? courtMatch[1].trim() : 'Unknown';
}

function extractDecision(htmlContent: string): string {
  const decisionMatch = htmlContent.match(/Decisão:<\/font><\/b><\/td><td width="74%" bgcolor="#E0F1FF"><font size="2"> <\/font><b><font size="2" color="#000080">([^<]*)<\/font><\/b><\/td><\/tr>/);
  return decisionMatch ? decisionMatch[1].trim() : 'Unknown';
}

function extractDescritores(htmlContent: string): string[] {
  const tagMatch = htmlContent.match(/Descritores:<\/font><\/b><\/td><td[^>]*bgcolor="#E0F1FF"><b><font size="2"> <\/font><\/b><b><font size="2" color="#000080">([\s\S]*?)<\/font><\/b><\/td><\/tr>/);
  if (!tagMatch) {
    return [];
  }
  const tags = tagMatch[1].split('<br>').map(tag => tag.trim());
  return tags;
}

function extractDecisionDate(htmlContent: string): string {
  const dateMatch = htmlContent.match(/Data do Acordão:<\/font><\/b><\/td><td[^>]*bgcolor="#E0F1FF"><b><font size="2"> <\/font><\/b><b><font size="2" color="#000080">([^<]*)<\/font><\/b><\/td><\/tr>/);
  return dateMatch ? dateMatch[1].trim() : new Date().toISOString();
}

function extractProcessText(htmlContent: string): string {
  const processTextMatch = htmlContent.match(/Decisão Texto Integral:<\/font><\/b><\/td><td[^>]*bgcolor="#FFFFFF"><b><font size="2"> <\/font><\/b><font size="2" color="#000080">([\s\S]*?)<\/font><\/td><\/tr>/);
  return processTextMatch ? processTextMatch[1].replace(/<[^>]+>/g, '').trim() : 'No process text available';
}