'use server';

/**
 * @fileOverview Personalized learning recommendations for GroMo Partners based on their sales performance data.
 *
 * - getPersonalizedLearningRecommendations - A function that analyzes sales performance data and provides personalized training recommendations.
 * - PersonalizedLearningRecommendationsInput - The input type for the getPersonalizedLearningRecommendations function.
 * - PersonalizedLearningRecommendationsOutput - The return type for the getPersonalizedLearningRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedLearningRecommendationsInputSchema = z.object({
  salesPerformanceData: z.string().describe('Sales performance data of the GroMo Partner.'),
  partnerId: z.string().describe('The ID of the GroMo Partner.'),
});
export type PersonalizedLearningRecommendationsInput = z.infer<typeof PersonalizedLearningRecommendationsInputSchema>;

const PersonalizedLearningRecommendationsOutputSchema = z.object({
  areasToImprove: z.array(z.string()).describe('Specific areas where the GroMo Partner needs improvement.'),
  recommendedTrainingModules: z.array(z.string()).describe('List of training modules recommended for the GroMo Partner.'),
  summary: z.string().describe('A summary of the sales performance analysis and recommendations.'),
});
export type PersonalizedLearningRecommendationsOutput = z.infer<typeof PersonalizedLearningRecommendationsOutputSchema>;

export async function getPersonalizedLearningRecommendations(
  input: PersonalizedLearningRecommendationsInput
): Promise<PersonalizedLearningRecommendationsOutput> {
  return personalizedLearningRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedLearningRecommendationsPrompt',
  input: {schema: PersonalizedLearningRecommendationsInputSchema},
  output: {schema: PersonalizedLearningRecommendationsOutputSchema},
  prompt: `You are an AI Learning Coach for GroMo Partners. Analyze the sales performance data of the GroMo Partner and provide personalized training recommendations.

  Sales Performance Data: {{{salesPerformanceData}}}
  Partner ID: {{{partnerId}}}

  Identify areas where the GroMo Partner struggles and recommend specific training modules to improve their skills and sales.
  Provide a summary of the analysis and recommendations.

  Areas to Improve:
  - [Area 1]
  - [Area 2]

  Recommended Training Modules:
  - [Module 1]
  - [Module 2]

  Summary: [Summary of the analysis and recommendations]
  `,
});

const personalizedLearningRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedLearningRecommendationsFlow',
    inputSchema: PersonalizedLearningRecommendationsInputSchema,
    outputSchema: PersonalizedLearningRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
