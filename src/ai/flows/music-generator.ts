'use server';
/**
 * @fileOverview AI music generator that creates music from a text prompt.
 *
 * - generateMusic - A function that generates music based on a prompt, duration, and mood.
 * - GenerateMusicInput - The input type for the generateMusic function.
 * - GenerateMusicOutput - The return type for the generateMusic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateMusicInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate music from (e.g., \'epic cinematic score\').'),
  duration: z.number().min(5).max(30).describe('The duration of the music in seconds.'),
  mood: z.string().optional().describe('The mood of the music (e.g., \'happy\', \'sad\').'),
});
export type GenerateMusicInput = z.infer<typeof GenerateMusicInputSchema>;

const GenerateMusicOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated music as a data URI (e.g., data:audio/wav;base64,...).'),
});
export type GenerateMusicOutput = z.infer<typeof GenerateMusicOutputSchema>;

export async function generateMusic(input: GenerateMusicInput): Promise<GenerateMusicOutput> {
  return generateMusicFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateMusicFlow = ai.defineFlow(
  {
    name: 'generateMusicFlow',
    inputSchema: GenerateMusicInputSchema,
    outputSchema: GenerateMusicOutputSchema,
  },
  async input => {
    let fullPrompt = input.prompt;
    if (input.mood) {
      fullPrompt = `${fullPrompt}, in a ${input.mood} mood.`;
    }

    const {stream, response} = ai.generateStream({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      prompt: fullPrompt,
      config: {
         responseModalities: ['AUDIO'],
         speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      }
    });

    let audioDataUri = '';
    for await (const chunk of stream) {
        if(chunk.media) {
            const audioBuffer = Buffer.from(
                chunk.media.url.substring(chunk.media.url.indexOf(',') + 1),
                'base64'
            );
            const wavBase64 = await toWav(audioBuffer);
            audioDataUri = `data:audio/wav;base64,${wavBase64}`;
            break; 
        }
    }
    
    await response;

    if (!audioDataUri) {
      throw new Error('No audio was generated.');
    }

    return { audioDataUri };
  }
);
