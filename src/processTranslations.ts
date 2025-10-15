import debug from 'debug';
import { UntranslatedKey } from './types';
import { translateKey } from './translator';
import { writeTranslation } from './fileWriter';
import { getBundleName } from './getBundleName';
import { readBundleReference } from './readBundleReference';

const log = debug('i18next-ai-translator:processTranslations');

/**
 * Process a list of untranslated keys and translate them via the OpenAI API
 * @param untranslatedKeys - List of keys to translate
 * @param apiKey - OpenAI API key
 * @param referenceContext - Optional reference context to improve translations
 * @param bundleReferenceFolder - Optional folder containing the reference files by bundle
 * @returns Number of successful and failed translations
 */
export async function processTranslations(
  untranslatedKeys: UntranslatedKey[],
  apiKey: string,
  referenceContext?: string,
  bundleReferenceFolder?: string
): Promise<{ success: number; failed: number }> {
  log('Starting translation process for %d keys', untranslatedKeys.length);

  let success = 0;
  let failed = 0;

  for (const key of untranslatedKeys) {
    try {
      log('Processing key: %s for locale: %s', key.keyPath.join('.'), key.locale);

      const textToTranslate = key.keyPath[key.keyPath.length - 1];

      let context = referenceContext;

      if (bundleReferenceFolder) {
        const bundleName = getBundleName(key.filePath);
        log('Bundle name extracted: %s', bundleName);

        const bundleContext = readBundleReference(bundleReferenceFolder, bundleName);

        if (bundleContext) {
          log('Using bundle-specific context');
          context = bundleContext;
        }
      }

      const translation = await translateKey(textToTranslate, key.locale, apiKey, context);
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
