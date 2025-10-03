import debug from 'debug';
import { callOpenAI } from './openaiClient';

const log = debug('i18next-ai-translator:translator');

export async function translateKey(
  key: string,
  targetLocale: string,
  apiKey: string,
  referenceContext?: string
): Promise<string> {
  log('Starting translation for key: %s to locale: %s', key, targetLocale);

  if (!key || key.trim() === '') {
    log('Error: Translation key is empty');
    throw new Error('Translation key cannot be empty');
  }

  let prompt = `Translate "${key}" to ${targetLocale}`;

  if (referenceContext) {
    log('Adding reference context to prompt');
    prompt += `\n\nContext: ${referenceContext}`;
  }

  log('Sending request to OpenAI API');

  try {
    const translation = await callOpenAI(prompt, apiKey);

    if (!translation) {
      log('Warning: Empty translation received from API');
      throw new Error('Empty translation received from API');
    }

    return translation;
  } catch (error) {
    log('Error during translation: %o', error);
    throw error;
  }
}
