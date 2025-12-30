"use server";

import { getMotivation as getMotivationFlow } from '@/ai/flows/motivation-flow';
import type { GetMotivationInput, GetMotivationOutput } from '@/ai/flows/motivation-flow';
import { generateMonthlyReport as generateMonthlyReportFlow } from '@/ai/flows/generate-monthly-progress-report';
import type { GenerateMonthlyReportInput, GenerateMonthlyReportOutput } from '@/ai/flows/generate-monthly-progress-report';

export async function getMotivation(input: GetMotivationInput): Promise<GetMotivationOutput> {
  try {
    const result = await getMotivationFlow(input);
    return result;
  } catch (error) {
    console.error("Error in getMotivation action:", error);
    throw new Error("Failed to get motivation due to a server error.");
  }
}

export async function generateMonthlyReport(input: GenerateMonthlyReportInput): Promise<GenerateMonthlyReportOutput> {
  try {
    const report = await generateMonthlyReportFlow(input);
    return report;
  } catch (error) {
    console.error("Error in generateMonthlyReport action:", error);
    throw new Error("Failed to generate report due to a server error.");
  }
}
