import { courtRulings, caseDetails, lawReferences, judgeRapporteurs, courts, decisions } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();
  const htmlFile = formData.get('htmlFile') as File;
  const jsonFile = formData.get('jsonFile') as File;

  if (!htmlFile || !jsonFile) {
    return new Response('Please upload both HTML and JSON files.', { status: 400 });
  }

  const htmlContent = await htmlFile.text();
  const jsonContent = await jsonFile.text();
  const jsonData = JSON.parse(jsonContent);

  if (!Array.isArray(jsonData)) {
    return new Response('Invalid JSON file format.', { status: 400 });
  }

  const processNumber = extractProcessNumber(htmlContent);
  const caseDescription = extractCaseDescription(htmlContent);
  const lawEntities = jsonData.filter((entity: any) => entity.label === 'LAW');

  // Ensure valid foreign key references
  const judgeRapporteurId = await getOrCreate(judgeRapporteurs, { name: 'Example Judge' });
  const courtId = await getOrCreate(courts, { name: 'Example Court' });
  const decisionId = await getOrCreate(decisions, { description: 'Example Decision' });

  const caseDetailsId = await db.insert(caseDetails).values({ description: caseDescription }).returning({ id: caseDetails.id });
  const courtRulingId = await db.insert(courtRulings).values({
    processNumber: processNumber,
    judgeRapporteur: judgeRapporteurId,
    court: courtId,
    decision: decisionId,
    date: new Date().toISOString(),
    caseDetailsId: caseDetailsId[0].id
  }).returning({ id: courtRulings.id });

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
  const result = await db.select().from(table).where(values).limit(1).execute();
  if (result.length > 0) {
    return result[0].id;
  }
  const insertResult = await db.insert(table).values(values).returning({ id: table.id }).execute();
  return insertResult[0].id;
}

function extractProcessNumber(htmlContent: string): string {
  // Implement logic to extract process number from HTML content
  return '1059/13.6TTCBR.C1.S1'; // Example value, replace with actual extraction logic
}

function extractCaseDescription(htmlContent: string): string {
  // Implement logic to extract case description from HTML content
  return 'Example case description'; // Example value, replace with actual extraction logic
}