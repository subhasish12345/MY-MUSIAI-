'use server';
/**
 * @fileOverview Generates AI art from a text prompt using style transfer.
 *
 * - generateArt - A function that generates AI art based on a text prompt and style.
 * - GenerateArtInput - The input type for the generateArt function.
 * - GenerateArtOutput - The return type for the generateArt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArtInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate art from (e.g., \'steampunk cat\').'),
  style: z.string().describe('The artistic style to apply (e.g., \'van gogh\', \'cyberpunk\').'),
});
export type GenerateArtInput = z.infer<typeof GenerateArtInputSchema>;

const GenerateArtOutputSchema = z.object({
  artDataUri: z.string().describe('The generated art as a data URI (e.g., data:image/png;base64,...).'),
});
export type GenerateArtOutput = z.infer<typeof GenerateArtOutputSchema>;

export async function generateArt(input: GenerateArtInput): Promise<GenerateArtOutput> {
  return generateArtFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArtPrompt',
  input: {schema: GenerateArtInputSchema},
  output: {schema: GenerateArtOutputSchema},
  prompt: `Generate an image based on the following prompt with the specified style.

Prompt: {{{prompt}}}
Style: {{{style}}}

Ensure the generated image is returned as a data URI.

{{#if style}}
Please generate the image in the style of {{{style}}}.{{/if}}`,
});

const generateArtFlow = ai.defineFlow(
  {
    name: 'generateArtFlow',
    inputSchema: GenerateArtInputSchema,
    outputSchema: GenerateArtOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.style ? `${input.prompt} in the style of ${input.style}` : input.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('No image was generated.');
    }

    return {artDataUri: media.url};
  }
);
