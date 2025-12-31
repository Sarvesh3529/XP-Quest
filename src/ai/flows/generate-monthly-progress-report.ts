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
  report: z.string().describe("A critical, no-nonsense summary of the user's performance, formatted in paragraphs."),
  improvementSuggestions: z
    .string()
    .describe('A direct, actionable, and bulleted list of commands for improvement.'),
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
  prompt: `You are a tough, no-nonsense performance coach. Your job is to provide brutally honest feedback to help users achieve peak performance. Do not use encouraging or soft language. Be direct and analytical.

Analyze the user's completed tasks for the month:
{{{completedTasks}}}

Based on this data, provide the following:
1.  A critical, no-nonsense 'Performance Debrief' that analyzes the user's achievements, weaknesses, and patterns. Identify what they did right and where they fell short.
2.  A bulleted list of 'Actionable Directives' for the next month. These must be clear, concise commands for improvement. Focus on weaknesses and maximizing strengths.`,
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
