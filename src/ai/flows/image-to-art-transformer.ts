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
  const {stream, response} = ai.generateStream({
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

  let transformedPhotoDataUri = '';
  for await (const chunk of stream) {
    if (chunk.media) {
      transformedPhotoDataUri = chunk.media.url;
      // Break early since we only need the image
      break;
    }
  }

  await response;
  return {transformedPhotoDataUri};
}

const imageToArtTransformerFlow = ai.defineFlow(
  {
    name: 'imageToArtTransformerFlow',
    inputSchema: ImageToArtTransformerInputSchema,
    outputSchema: ImageToArtTransformerOutputSchema,
  },
  imageToArtTransformer
);
