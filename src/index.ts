import debug from 'debug';
import fs from 'fs';
import { loadConfig } from './envHandler';
import { readTranslationFiles, findUntranslatedKeys } from './fileReader';
import { processTranslations } from './processTranslations';

const log = debug('i18next-ai-translator:index');

/**
 * Main function that orchestrates the translation process
 * @param localesFolder - Path to the folder containing the translation files
 * @returns Number of successful and failed translations
 */
export async function run(localesFolder: string): Promise<{ success: number; failed: number }> {
  log('Starting i18next-ai-translator');
  log('Locales folder: %s', localesFolder);

  const config = loadConfig();
  log('Configuration loaded');

  const translationFiles = readTranslationFiles(localesFolder);
  log('Found %d translation files', translationFiles.length);

  const untranslatedKeys = findUntranslatedKeys(translationFiles);
  log('Found %d untranslated keys', untranslatedKeys.length);

  if (untranslatedKeys.length === 0) {
    log('No untranslated keys found');
    return { success: 0, failed: 0 };
  }

  let referenceContext: string | undefined;
  if (config.referenceFile && fs.existsSync(config.referenceFile)) {
    log('Reading global reference file: %s', config.referenceFile);
    referenceContext = fs.readFileSync(config.referenceFile, 'utf-8');
  }

  log('Starting translation process');
  const result = await processTranslations(
    untranslatedKeys,
    config.apiKey,
    referenceContext,
    config.bundleReferenceFolder
  );

  log('Translation process completed. Success: %d, Failed: %d', result.success, result.failed);

  return result;
}
