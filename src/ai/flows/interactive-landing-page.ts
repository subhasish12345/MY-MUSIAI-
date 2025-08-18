'use server';

/**
 * @fileOverview Flow for generating a visually engaging, AI-generated 3D background for the landing page that morphs and adapts.
 *
 * - generate3DBackground - A function that generates the 3D background.
 * - Generate3DBackgroundInput - The input type for the generate3DBackground function.
 * - Generate3DBackgroundOutput - The return type for the generate3DBackground function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const Generate3DBackgroundInputSchema = z.object({
  theme: z
    .string()
    .default('abstract')
    .describe('The theme for the 3D background.'),
});
export type Generate3DBackgroundInput = z.infer<typeof Generate3DBackgroundInputSchema>;

const Generate3DBackgroundOutputSchema = z.object({
  backgroundDataUri: z
    .string()
    .describe(
      'The data URI of the generated 3D background, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type Generate3DBackgroundOutput = z.infer<typeof Generate3DBackgroundOutputSchema>;

export async function generate3DBackground(input: Generate3DBackgroundInput): Promise<Generate3DBackgroundOutput> {
  return generate3DBackgroundFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generate3DBackgroundPrompt',
  input: {schema: Generate3DBackgroundInputSchema},
  output: {schema: Generate3DBackgroundOutputSchema},
  prompt: `Generate a visually engaging, AI-generated 3D background with a morphing particle system based on the following theme: {{{theme}}}. Return the generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.`,
});

const generate3DBackgroundFlow = ai.defineFlow(
  {
    name: 'generate3DBackgroundFlow',
    inputSchema: Generate3DBackgroundInputSchema,
    outputSchema: Generate3DBackgroundOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a visually engaging, AI-generated 3D background with a morphing particle system based on the following theme: ${input.theme}.`, // Incorporate the theme from the input
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    return {backgroundDataUri: media!.url!};
  }
);
