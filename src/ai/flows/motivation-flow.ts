'use server';

/**
 * @fileOverview Generates a motivational message based on the user's wake-up time.
 *
 * - getMotivation - A function that generates the motivational message.
 * - GetMotivationInput - The input type for the getMotivation function.
 * - GetMotivationOutput - The return type for the getMotivation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetMotivationInputSchema = z.object({
  wakeUpTime: z
    .string()
    .describe('The time the user woke up, in HH:mm format (e.g., 07:00).'),
});
export type GetMotivationInput = z.infer<typeof GetMotivationInputSchema>;

const GetMotivationOutputSchema = z.object({
  message: z.string().describe('A short, positive motivational message.'),
});
export type GetMotivationOutput = z.infer<typeof GetMotivationOutputSchema>;

export async function getMotivation(input: GetMotivationInput): Promise<GetMotivationOutput> {
  return getMotivationFlow(input);
}

const getMotivationPrompt = ai.definePrompt({
  name: 'getMotivationPrompt',
  input: {schema: GetMotivationInputSchema},
  output: {schema: GetMotivationOutputSchema},
  prompt: `You are a motivational AI assistant.  Provide a short, positive message for a user who woke up at {{{wakeUpTime}}}.  The message should be no more than 2 sentences.\n\nMessage:\n`,
});

const getMotivationFlow = ai.defineFlow(
  {
    name: 'getMotivationFlow',
    inputSchema: GetMotivationInputSchema,
    outputSchema: GetMotivationOutputSchema,
  },
  async input => {
    const {output} = await getMotivationPrompt(input);
    return output!;
  }
);
