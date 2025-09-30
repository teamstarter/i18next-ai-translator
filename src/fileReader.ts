import fs from 'fs';
import path from 'path';
import debug from 'debug';
import { TranslationFile, UntranslatedKey } from './types';

const log = debug('i18next-ai-translator:fileReader');

export function readTranslationFiles(localesFolderPath: string): TranslationFile[] {
  log('Reading translation files from: %s', localesFolderPath);

  if (!fs.existsSync(localesFolderPath)) {
    log('Error: Folder does not exist: %s', localesFolderPath);
    throw new Error(`The folder ${localesFolderPath} does not exist`);
  }

  const files = fs.readdirSync(localesFolderPath);
  log('Found %d files in folder', files.length);

  const jsonFiles = files.filter(file => file.endsWith('.json'));
  log('Filtered to %d JSON files', jsonFiles.length);

  const translationFiles: TranslationFile[] = [];

  for (const file of jsonFiles) {
    const filePath = path.join(localesFolderPath, file);
    const locale = path.basename(file, '.json');

    log('Reading file: %s (locale: %s)', file, locale);

    const content = fs.readFileSync(filePath, 'utf-8');
    const translations = JSON.parse(content);

    translationFiles.push({
      locale,
      filePath,
      translations,
    });

    log('Successfully loaded %s with %d root keys', file, Object.keys(translations).length);
  }

  log('Total translation files loaded: %d', translationFiles.length);
  return translationFiles;
}

function findKeysRecursive(
  obj: Record<string, unknown>,
  currentPath: string[] = [],
  untranslatedValue: string
): string[][] {
  const untranslatedPaths: string[][] = [];

  for (const [key, value] of Object.entries(obj)) {
    const newPath = [...currentPath, key];

    if (typeof value === 'object' && value !== null) {
      const nestedPaths = findKeysRecursive(
        value as Record<string, unknown>,
        newPath,
        untranslatedValue
      );
      untranslatedPaths.push(...nestedPaths);
    } else if (value === untranslatedValue) {
      log('Found untranslated key: %s', newPath.join('.'));
      untranslatedPaths.push(newPath);
    }
  }

  return untranslatedPaths;
}

export function findUntranslatedKeys(
  translationFiles: TranslationFile[],
  untranslatedValue: string = '__STRING_NOT_TRANSLATED__'
): UntranslatedKey[] {
  log('Searching for untranslated keys with value: "%s"', untranslatedValue);
  log('Processing %d translation files', translationFiles.length);

  const untranslatedKeys: UntranslatedKey[] = [];

  for (const file of translationFiles) {
    log('Analyzing file: %s (locale: %s)', file.filePath, file.locale);

    const keyPaths = findKeysRecursive(file.translations, [], untranslatedValue);
    log('Found %d untranslated keys in %s', keyPaths.length, file.locale);

    for (const keyPath of keyPaths) {
      untranslatedKeys.push({
        keyPath: keyPath,
        locale: file.locale,
        filePath: file.filePath,
      });
    }
  }

  log('Total untranslated keys found: %d', untranslatedKeys.length);
  return untranslatedKeys;
}
