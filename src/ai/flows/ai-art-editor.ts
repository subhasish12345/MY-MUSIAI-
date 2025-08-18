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
    .describe("The edited image, as a data URI in base64 format."),
  editSummary: z
    .string()
    .describe('A summary of the edits that were performed.'),
});

export type AIArtEditorOutput = z.infer<typeof AIArtEditorOutputSchema>;

export async function aiArtEditor(input: AIArtEditorInput): Promise<AIArtEditorOutput> {
  return aiArtEditorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiArtEditorPrompt',
  input: {schema: AIArtEditorInputSchema},
  output: {schema: AIArtEditorOutputSchema},
  prompt: `You are a professional AI-powered art editor. You will receive an image and instructions on how to edit it.

  Instructions: {{{editInstructions}}}
  {{#if paletteAdjustment}}
  Palette Adjustment: {{{paletteAdjustment}}}
  {{/if}}
  {{#if enhancementLevel}}
  Enhancement Level: {{{enhancementLevel}}}
  {{/if}}

  Apply the instructions to the image provided.
  
  Image: {{media url=imageUri}}

  Return the edited image as a data URI and provide a summary of the edits performed.
  Ensure the 'editedImageUri' is a data URI with proper MIME type and base64 encoding.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const aiArtEditorFlow = ai.defineFlow(
  {
    name: 'aiArtEditorFlow',
    inputSchema: AIArtEditorInputSchema,
    outputSchema: AIArtEditorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
