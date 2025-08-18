'use server';
/**
 * @fileOverview Image to Art Transformer AI agent.
 *
 * - imageToArtTransformer - A function that handles the image transformation process.
 * - ImageToArtTransformerInput - The input type for the imageToArtTransformer function.
 * - ImageToArtTransformerOutput - The return type for the imageToArtTransformer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageToArtTransformerInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "The image to transform, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  style: z.string().describe('The artistic style to apply to the image.'),
  styleMixRatio: z
    .number()
    .min(0)
    .max(1)
    .default(0.5)
    .describe(
      'The ratio of the original image style to the applied style. 0 for fully transformed, 1 for original image.'
    ),
});
export type ImageToArtTransformerInput = z.infer<
  typeof ImageToArtTransformerInputSchema
>;

const ImageToArtTransformerOutputSchema = z.object({
  transformedPhotoDataUri: z
    .string()
    .describe('The transformed image, as a base64 encoded data URI.'),
});
export type ImageToArtTransformerOutput = z.infer<
  typeof ImageToArtTransformerOutputSchema
>;

export async function imageToArtTransformer(
  input: ImageToArtTransformerInput
): Promise<ImageToArtTransformerOutput> {
  return imageToArtTransformerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'imageToArtTransformerPrompt',
  input: {schema: ImageToArtTransformerInputSchema},
  output: {schema: ImageToArtTransformerOutputSchema},
  prompt: `You are an AI artist that can transform images into new artworks using style transfer.

  The user will provide an image and a desired style. You should use the style to transform the image into a new artwork.
  The user can also specify a style mix ratio to control the strength of the style transfer.

  Original Image: {{media url=photoDataUri}}
  Style: {{{style}}}
  Style Mix Ratio: {{{styleMixRatio}}}

  Return the transformed image as a base64 encoded data URI.`, // Removed the explicit format instruction.
});

const imageToArtTransformerFlow = ai.defineFlow(
  {
    name: 'imageToArtTransformerFlow',
    inputSchema: ImageToArtTransformerInputSchema,
    outputSchema: ImageToArtTransformerOutputSchema,
  },
  async input => {
    const {
      output: {transformedPhotoDataUri},
    } = await ai.generate({
      prompt: [
        {media: {url: input.photoDataUri}},
        {
          text: `Transform this image to look like it was created in the style of ${input.style}`,
        },
      ],
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {transformedPhotoDataUri: transformedPhotoDataUri!};
  }
);
