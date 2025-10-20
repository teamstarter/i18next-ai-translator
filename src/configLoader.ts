import fs from 'fs';
import path from 'path';
import debug from 'debug';
import { createJiti } from 'jiti';

const log = debug('i18next-ai-translator:configLoader');

/**
 * Load the default value for untranslated keys from a config file
 * @param configFilePath - Optional path to the config file
 * @returns The default value to use for untranslated keys
 */
export function loadDefaultValue(configFilePath?: string): string {
  log('Loading default value from config');

  const defaultValue = '__STRING_NOT_TRANSLATED__';

  if (!configFilePath) {
    log('No config file provided, using default value');
    return defaultValue;
  }

  const absolutePath = path.resolve(configFilePath);
  log('Config file path: %s', absolutePath);

  if (!fs.existsSync(absolutePath)) {
    log('Config file does not exist: %s', absolutePath);
    return defaultValue;
  }

  try {
    log('Reading config file with jiti');
    const jiti = createJiti(__filename);
    const config = jiti(absolutePath);
    log('Config loaded successfully');

    const customValue = config?.options?.defaultValue;

    if (customValue) {
      log('Custom default value found: %s', customValue);
      return customValue;
    }

    log('No defaultValue found in config, using default');
    return defaultValue;
  } catch (error) {
    log('Error loading config file: %o', error);
    return defaultValue;
  }
}
