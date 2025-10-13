import fs from 'fs';
import debug from 'debug';

const log = debug('i18next-ai-translator:fileWriter');

/**
 * Write a translation in a JSON file
 * @param filePath - Path to the JSON file
 * @param keyPath - Path to the key (ex: ['login'])
 * @param translation - The translation to write
 */
export function writeTranslation(filePath: string, keyPath: string[], translation: string): void {
  log('Writing translation to %s for key %s', filePath, keyPath.join('.'));

  if (!fs.existsSync(filePath)) {
    log('Error: File does not exist: %s', filePath);
    throw new Error(`File does not exist: ${filePath}`);
  }

  log('Reading file: %s', filePath);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const jsonObject = JSON.parse(fileContent);

  // Navigate in the object to reach the key
  let current: Record<string, unknown> = jsonObject;

  // Descend in the tree until the second last key
  for (let i = 0; i < keyPath.length - 1; i++) {
    const key = keyPath[i];
    current = current[key] as Record<string, unknown>;
  }

  // Replace the value at the last key
  const lastKey = keyPath[keyPath.length - 1];
  log('Replacing value at key "%s" with: %s', lastKey, translation);
  current[lastKey] = translation;

  const updatedContent = JSON.stringify(jsonObject, null, 2);
  log('Writing updated content to file');
  fs.writeFileSync(filePath, updatedContent, 'utf-8');

  log('Translation written successfully');
}
