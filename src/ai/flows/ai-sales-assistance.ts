// src/ai/flows/ai-sales-assistance.ts
'use server';

/**
 * @fileOverview An AI sales assistance flow for GroMo Partners.
 *
 * - assistSales - A function that provides sales assistance during live calls or chats.
 * - AssistSalesInput - The input type for the assistSales function.
 * - AssistSalesOutput - The return type for the assistSales function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssistSalesInputSchema = z.object({
  context: z.string().describe('The current context of the sales call or chat.'),
  productDetails: z.string().describe('Details about the product being sold.'),
  customerProfile: z.string().describe('Information about the customer.'),
});
export type AssistSalesInput = z.infer<typeof AssistSalesInputSchema>;

const AssistSalesOutputSchema = z.object({
  suggestedPitch: z.string().describe('A suggested pitch line for the current situation.'),
  objectionCounter: z.string().describe('A suggestion for countering a potential objection.'),
  warmLeadDetected: z.boolean().describe('Whether a warm lead is detected.'),
});
export type AssistSalesOutput = z.infer<typeof AssistSalesOutputSchema>;

export async function assistSales(input: AssistSalesInput): Promise<AssistSalesOutput> {
  return assistSalesFlow(input);
}

const assistSalesPrompt = ai.definePrompt({
  name: 'assistSalesPrompt',
  input: {schema: AssistSalesInputSchema},
  output: {schema: AssistSalesOutputSchema},
  prompt: `You are an AI sales co-pilot assisting a GroMo Partner during a live sales call or chat.

  Based on the current context, product details, and customer profile, provide the most relevant assistance.

  Context: {{{context}}}
  Product Details: {{{productDetails}}}
  Customer Profile: {{{customerProfile}}}

  Consider suggesting a pitch line, helping counter potential objections, and determining if a warm lead is detected.

  Output your response as a JSON object with the following schema:
  {
    "suggestedPitch": "A suggested pitch line for the current situation.",
    "objectionCounter": "A suggestion for countering a potential objection.",
    "warmLeadDetected": true/false
  }`,
});

const assistSalesFlow = ai.defineFlow(
  {
    name: 'assistSalesFlow',
    inputSchema: AssistSalesInputSchema,
    outputSchema: AssistSalesOutputSchema,
  },
  async input => {
    const {output} = await assistSalesPrompt(input);
    return output!;
  }
);
