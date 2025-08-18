'use server';

import {
  generateArt,
  type GenerateArtInput,
} from '@/ai/flows/text-to-art-generator';
import {
  imageToArtTransformer,
  type ImageToArtTransformerInput,
} from '@/ai/flows/image-to-art-transformer';
import {
  aiArtEditor,
  type AIArtEditorInput,
} from '@/ai/flows/ai-art-editor';
import {
  smartSearchAutosuggest,
  type SmartSearchAutosuggestInput,
} from '@/ai/flows/smart-search-autosuggest';
import {
  generateMusic,
  type GenerateMusicInput,
} from '@/ai/flows/music-generator';

export async function handleGenerateArt(input: GenerateArtInput) {
  try {
    const result = await generateArt(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate art. Please try again.' };
  }
}

export async function handleImageToArt(input: ImageToArtTransformerInput) {
  try {
    const result = await imageToArtTransformer(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to transform image. Please try again.' };
  }
}

export async function handleAiArtEdit(input: AIArtEditorInput) {
  try {
    const result = await aiArtEditor(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to edit art. Please try again.' };
  }
}

export async function handleSmartSearch(input: SmartSearchAutosuggestInput) {
  try {
    const result = await smartSearchAutosuggest(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to get search suggestions. Please try again.' };
  }
}

export async function handleGenerateMusic(input: GenerateMusicInput) {
    try {
        const result = await generateMusic(input);
        return result;
    } catch (error) {
        console.error(error);
        return { error: 'Failed to generate music. Please try again.' };
    }
}
