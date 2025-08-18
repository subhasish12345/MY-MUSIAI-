'use server';

import {
  generateArt,
  type GenerateArtInput,
  type GenerateArtOutput,
} from '@/ai/flows/text-to-art-generator';
import {
  imageToArtTransformer,
  type ImageToArtTransformerInput,
  type ImageToArtTransformerOutput,
} from '@/ai/flows/image-to-art-transformer';
import {
  aiArtEditor,
  type AIArtEditorInput,
  type AIArtEditorOutput,
} from '@/ai/flows/ai-art-editor';
import {
  smartSearchAutosuggest,
  type SmartSearchAutosuggestInput,
  type SmartSearchAutosuggestOutput,
} from '@/ai/flows/smart-search-autosuggest';
import {
  generateMusic,
  type GenerateMusicInput,
  type GenerateMusicOutput,
} from '@/ai/flows/music-generator';

type ActionResponse<T> = (T & { error?: never }) | { error: string };

export async function handleGenerateArt(input: GenerateArtInput): Promise<ActionResponse<GenerateArtOutput>> {
  try {
    const result = await generateArt(input);
    if (!result || !result.artDataUri) {
        return { error: 'The AI failed to generate an image. Please try a different prompt.' };
    }
    return result;
  } catch (error: any) {
    console.error('Error in handleGenerateArt:', error);
    return { error: error.message || 'An unexpected error occurred while generating art.' };
  }
}

export async function handleImageToArt(input: ImageToArtTransformerInput): Promise<ActionResponse<ImageToArtTransformerOutput>> {
  try {
    const result = await imageToArtTransformer(input);
     if (!result || !result.transformedPhotoDataUri) {
        return { error: 'The AI failed to transform the image. Please try a different style or image.' };
    }
    return result;
  } catch (error: any) {
    console.error('Error in handleImageToArt:', error);
    return { error: error.message || 'An unexpected error occurred while transforming the image.' };
  }
}

export async function handleAiArtEdit(input: AIArtEditorInput): Promise<ActionResponse<AIArtEditorOutput>> {
  try {
    const result = await aiArtEditor(input);
    if (!result || !result.editedImageUri) {
        return { error: 'The AI failed to edit the image. Please try different instructions.' };
    }
    return result;
  } catch (error: any) {
    console.error('Error in handleAiArtEdit:', error);
    return { error: error.message || 'An unexpected error occurred while editing the art.' };
  }
}

export async function handleSmartSearch(input: SmartSearchAutosuggestInput): Promise<ActionResponse<SmartSearchAutosuggestOutput>> {
  try {
    const result = await smartSearchAutosuggest(input);
    return result;
  } catch (error: any) {
    console.error('Error in handleSmartSearch:', error);
    return { error: error.message || 'An unexpected error occurred while getting search suggestions.' };
  }
}

export async function handleGenerateMusic(input: GenerateMusicInput): Promise<ActionResponse<GenerateMusicOutput>> {
    try {
        const result = await generateMusic(input);
        if (!result || !result.audioDataUri) {
            return { error: 'The AI failed to generate music. Please try a different prompt.' };
        }
        return result;
    } catch (error: any) {
        console.error('Error in handleGenerateMusic:', error);
        return { error: error.message || 'An unexpected error occurred while generating music.' };
    }
}
