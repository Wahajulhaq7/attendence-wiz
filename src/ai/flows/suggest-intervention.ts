// src/ai/flows/suggest-intervention.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting personalized interventions for students with frequent absences.
 *
 * - suggestIntervention - A function that takes a student's name and absence record and returns suggested interventions.
 * - SuggestInterventionInput - The input type for the suggestIntervention function.
 * - SuggestInterventionOutput - The return type for the suggestIntervention function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInterventionInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  absenceRecord: z
    .string()
    .describe(
      'A description of the students attendance record, including the number of absences and any reasons known for the absences.'
    ),
});
export type SuggestInterventionInput = z.infer<typeof SuggestInterventionInputSchema>;

const SuggestInterventionOutputSchema = z.object({
  interventionSuggestions: z
    .array(z.string())
    .describe('A list of personalized intervention suggestions for the student.'),
});
export type SuggestInterventionOutput = z.infer<typeof SuggestInterventionOutputSchema>;

export async function suggestIntervention(input: SuggestInterventionInput): Promise<SuggestInterventionOutput> {
  return suggestInterventionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInterventionPrompt',
  input: {schema: SuggestInterventionInputSchema},
  output: {schema: SuggestInterventionOutputSchema},
  prompt: `You are a compassionate and experienced teacher. A student is exhibiting poor attendence and you need to suggest possible interventions.

  Student Name: {{{studentName}}}
  Absence Record: {{{absenceRecord}}}

  Based on the student's name and absence record, suggest personalized interventions to improve their attendance. Return a list of 3-5 possible suggestions that are likely to be effective. Consider a variety of interventions, such as:

  *   Parent-teacher conferences
  *   Counseling
  *   Academic support
  *   Mentoring
  *   Incentives for good attendance
`,
});

const suggestInterventionFlow = ai.defineFlow(
  {
    name: 'suggestInterventionFlow',
    inputSchema: SuggestInterventionInputSchema,
    outputSchema: SuggestInterventionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
