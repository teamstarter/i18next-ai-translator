import fs from 'fs';
import path from 'path';
import { TranslationFile, UntranslatedKey } from './types';

export function readTranslationFiles(localesFolderPath: string): TranslationFile[] {
  if (!fs.existsSync(localesFolderPath)) {
    throw new Error(`The folder ${localesFolderPath} does not exist`);
  }

  const files = fs.readdirSync(localesFolderPath);
  const jsonFiles = files.filter(file => file.endsWith('.json'));

  const translationFiles: TranslationFile[] = [];

  for (const file of jsonFiles) {
    const filePath = path.join(localesFolderPath, file);
    const locale = path.basename(file, '.json');

    const content = fs.readFileSync(filePath, 'utf-8');
    const translations = JSON.parse(content);

    translationFiles.push({
      locale,
      filePath,
      translations,
    });
  }

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
      untranslatedPaths.push(newPath);
    }
  }

  return untranslatedPaths;
}

export function findUntranslatedKeys(
  translationFiles: TranslationFile[],
  untranslatedValue: string = '__STRING_NOT_TRANSLATED__'
): UntranslatedKey[] {
  const untranslatedKeys: UntranslatedKey[] = [];

  for (const file of translationFiles) {
    const keyPaths = findKeysRecursive(file.translations, [], untranslatedValue);

    for (const keyPath of keyPaths) {
      untranslatedKeys.push({
        keyPath: keyPath,
        locale: file.locale,
        filePath: file.filePath,
      });
    }
  }

  return untranslatedKeys;
}
