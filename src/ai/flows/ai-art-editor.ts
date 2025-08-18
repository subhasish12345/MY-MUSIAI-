'use server';
/**
 * @fileOverview AI-powered art editor flow for inpainting, outpainting, palette editing, and image enhancement.
 *
 * - aiArtEditor - A function that handles the AI art editing process.
 * - AIArtEditorInput - The input type for the aiArtEditor function.
 * - AIArtEditorOutput - The return type for the aiArtEditor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIArtEditorInputSchema = z.object({
  imageUri: z
    .string()
    .describe(
      "The image to be edited, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  editInstructions: z
    .string()
    .describe('Detailed instructions for editing the image.'),
  paletteAdjustment: z
    .string()
    .optional()
    .describe('Adjustments to the color palette (e.g., warmer, cooler).'),
  enhancementLevel: z
    .enum(['low', 'medium', 'high'])
    .optional()
    .describe('Level of image quality enhancement.'),
});

export type AIArtEditorInput = z.infer<typeof AIArtEditorInputSchema>;

const AIArtEditorOutputSchema = z.object({
  editedImageUri: z
    .string()
    .describe('The edited image, as a data URI in base64 format.'),
  editSummary: z
    .string()
    .describe('A summary of the edits that were performed.'),
});

export type AIArtEditorOutput = z.infer<typeof AIArtEditorOutputSchema>;

export async function aiArtEditor(
  input: AIArtEditorInput
): Promise<AIArtEditorOutput> {
  const {stream, response} = ai.generateStream({
    prompt: [
      {media: {url: input.imageUri}},
      {
        text: `Edit the image with the following instructions: ${
          input.editInstructions
        }. Palette Adjustment: ${
          input.paletteAdjustment || 'none'
        }, Enhancement Level: ${input.enhancementLevel || 'none'}. 
        Summarize the edits you made.`,
      },
    ],
    model: 'googleai/gemini-2.0-flash-preview-image-generation',
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  let editedImageUri = '';
  let editSummary = '';

  for await (const chunk of stream) {
    if (chunk.media) {
      editedImageUri = chunk.media.url;
    }
    if (chunk.text) {
      editSummary += chunk.text;
    }
  }

  await response;
  return {editedImageUri, editSummary};
}

const aiArtEditorFlow = ai.defineFlow(
  {
    name: 'aiArtEditorFlow',
    inputSchema: AIArtEditorInputSchema,
    outputSchema: AIArtEditorOutputSchema,
  },
  aiArtEditor
);
