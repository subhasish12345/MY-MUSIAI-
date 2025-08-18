// This is a server-side file.
'use server';

/**
 * @fileOverview This file defines the Genkit flow for providing AI-powered autosuggestions for the smart search feature.
 *
 * - smartSearchAutosuggest - A function that takes a search query and returns autosuggestions for artists, styles, and keywords.
 * - SmartSearchAutosuggestInput - The input type for the smartSearchAutosuggest function.
 * - SmartSearchAutosuggestOutput - The return type for the smartSearchAutosuggest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSearchAutosuggestInputSchema = z.object({
  query: z.string().describe('The user search query.'),
});
export type SmartSearchAutosuggestInput = z.infer<
  typeof SmartSearchAutosuggestInputSchema
>;

const SmartSearchAutosuggestOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      type: z.enum(['artist', 'style', 'keyword']).describe('The type of suggestion.'),
      value: z.string().describe('The suggestion value.'),
      previewImageUrl: z.string().optional().describe('URL for a visual preview of the suggestion.'),
      trustStats: z
        .object({
          numberOfWorks: z.number().optional().describe('Number of works associated with the suggestion.'),
          numberOfArtists: z.number().optional().describe('Number of artists associated with the suggestion.'),
        })
        .optional()
        .describe('Trust statistics for the suggestion.'),
    })
  ).describe('A list of autosuggestions.'),
});
export type SmartSearchAutosuggestOutput = z.infer<
  typeof SmartSearchAutosuggestOutputSchema
>;

export async function smartSearchAutosuggest(
  input: SmartSearchAutosuggestInput
): Promise<SmartSearchAutosuggestOutput> {
  return smartSearchAutosuggestFlow(input);
}

const smartSearchAutosuggestPrompt = ai.definePrompt({
  name: 'smartSearchAutosuggestPrompt',
  input: {schema: SmartSearchAutosuggestInputSchema},
  output: {schema: SmartSearchAutosuggestOutputSchema},
  prompt: `You are an AI assistant that provides autosuggestions for an art marketplace search bar.

  Given the user's search query, generate a list of autosuggestions for artists, styles, and keywords that are relevant to the query.

  Each suggestion should include a type (artist, style, or keyword) and a value (the suggestion itself).

  If available, include a preview image URL and trust statistics (number of works, number of artists) for each suggestion.

  User Query: {{{query}}}

  Format your response as a JSON array of suggestions, following this schema:
  {{print schema=SmartSearchAutosuggestOutputSchema}}
  `,
});

const smartSearchAutosuggestFlow = ai.defineFlow(
  {
    name: 'smartSearchAutosuggestFlow',
    inputSchema: SmartSearchAutosuggestInputSchema,
    outputSchema: SmartSearchAutosuggestOutputSchema,
  },
  async input => {
    const {output} = await smartSearchAutosuggestPrompt(input);
    return output!;
  }
);
