import debug from 'debug';
import { UntranslatedKey } from './types';
import { translateKey } from './translator';
import { writeTranslation } from './fileWriter';

const log = debug('i18next-ai-translator:processTranslations');

/**
 * Process a list of untranslated keys and translate them via the OpenAI API
 * @param untranslatedKeys - List of keys to translate
 * @param apiKey - OpenAI API key
 * @param referenceContext - Optional reference context to improve translations
 * @returns Number of successful and failed translations
 */

export async function processTranslations(
  untranslatedKeys: UntranslatedKey[],
  apiKey: string,
  referenceContext?: string
): Promise<{ success: number; failed: number }> {
  log('Starting translation process for %d keys', untranslatedKeys.length);

  let success = 0;
  let failed = 0;

  for (const key of untranslatedKeys) {
    try {
      log('Processing key: %s for locale: %s', key.keyPath.join('.'), key.locale);

      // Extract the text to translate (last element of the keyPath)
      const textToTranslate = key.keyPath[key.keyPath.length - 1];

      const translation = await translateKey(textToTranslate, key.locale, apiKey, referenceContext);
      log('Translation received: %s', translation);

      writeTranslation(key.filePath, key.keyPath, translation);
      log('Translation written successfully');

      success++;
    } catch (error) {
      log('Error translating key %s: %o', key.keyPath.join('.'), error);
      failed++;
    }
  }

  log('Translation process completed. Success: %d, Failed: %d', success, failed);

  return { success, failed };
}
