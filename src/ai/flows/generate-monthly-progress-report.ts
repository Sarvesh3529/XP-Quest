'use server';

/**
 * @fileOverview Generates a monthly progress report using AI based on completed tasks.
 *
 * - generateMonthlyReport - A function that generates the monthly progress report.
 * - GenerateMonthlyReportInput - The input type for the generateMonthlyReport function.
 * - GenerateMonthlyReportOutput - The return type for the generateMonthlyReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMonthlyReportInputSchema = z.object({
  completedTasks: z
    .string()
    .describe("A list of completed tasks for the month, separated by commas."),
});
export type GenerateMonthlyReportInput = z.infer<typeof GenerateMonthlyReportInputSchema>;

const GenerateMonthlyReportOutputSchema = z.object({
  report: z.string().describe('The generated monthly progress report.'),
  improvementSuggestions:
    z.string().describe('Suggestions for improvement in the next month.'),
});
export type GenerateMonthlyReportOutput = z.infer<typeof GenerateMonthlyReportOutputSchema>;

export async function generateMonthlyReport(
  input: GenerateMonthlyReportInput
): Promise<GenerateMonthlyReportOutput> {
  return generateMonthlyReportFlow(input);
}

const generateMonthlyReportPrompt = ai.definePrompt({
  name: 'generateMonthlyReportPrompt',
  input: {schema: GenerateMonthlyReportInputSchema},
  output: {schema: GenerateMonthlyReportOutputSchema},
  prompt: `You are an AI assistant that generates monthly progress reports based on completed tasks.

  Completed Tasks: {{{completedTasks}}}

  Generate a comprehensive monthly progress report, including insights into the user's productivity and suggestions for improvement in the next month.
  Your report should be detailed and actionable.
  Make sure to use the improvementSuggestions in the {{output.schema}} schema to generate suggestions for improvement in the next month based on the user's completed tasks
  Report:
  `,
});

const generateMonthlyReportFlow = ai.defineFlow(
  {
    name: 'generateMonthlyReportFlow',
    inputSchema: GenerateMonthlyReportInputSchema,
    outputSchema: GenerateMonthlyReportOutputSchema,
  },
  async input => {
    const {output} = await generateMonthlyReportPrompt(input);
    return output!;
  }
);
