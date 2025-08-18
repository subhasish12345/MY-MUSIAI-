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

export async function generateArt(
  input: GenerateArtInput
): Promise<GenerateArtOutput> {
  const {stream, response} = ai.generateStream({
    model: 'googleai/gemini-2.0-flash-preview-image-generation',
    prompt: input.style
      ? `${input.prompt} in the style of ${input.style}`
      : input.prompt,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  let artDataUri = '';
  for await (const chunk of stream) {
    if (chunk.media) {
      artDataUri = chunk.media.url;
      // We only need the image, so we can break early
      break;
    }
  }

  await response;
  if (!artDataUri) {
    throw new Error('No image was generated.');
  }

  return {artDataUri};
}

const generateArtFlow = ai.defineFlow(
  {
    name: 'generateArtFlow',
    inputSchema: GenerateArtInputSchema,
    outputSchema: GenerateArtOutputSchema,
  },
  generateArt
);
