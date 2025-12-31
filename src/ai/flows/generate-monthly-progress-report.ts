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
    .describe('A list of completed tasks for the month, separated by commas.'),
});
export type GenerateMonthlyReportInput = z.infer<typeof GenerateMonthlyReportInputSchema>;

const GenerateMonthlyReportOutputSchema = z.object({
  report: z.string().describe('The generated monthly progress report, formatted in paragraphs.'),
  improvementSuggestions: z
    .string()
    .describe('Suggestions for improvement in the next month, formatted as a bulleted or numbered list.'),
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
  prompt: `You are a Life Coach AI. Your role is to provide encouraging and insightful monthly progress reports based on a user's completed tasks.

Analyze the following list of tasks completed this month:
{{{completedTasks}}}

Based on these tasks, generate:
1.  A comprehensive, paragraph-based 'Monthly Progress Report' that summarizes the user's achievements and patterns.
2.  A bulleted or numbered list of 'Improvement Suggestions' with actionable advice for the upcoming month.`,
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
