import dotenv from 'dotenv';
import { Config } from './types';
import { loadDefaultValue } from './configLoader';

dotenv.config();

export function loadConfig(env: Record<string, string | undefined> = process.env): Config {
  const apiKey = env.I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY;

  if (!apiKey) {
    throw new Error(
      'API key missing !\n' +
        'Set the variable I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY\n' +
        'Example: export I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY=your-key\n' +
        'Or use a .env file'
    );
  }

  const configFile = env.I18NEXT_AI_TRANSLATOR_CONFIG;

  const defaultValue = loadDefaultValue(configFile);

  return {
    apiKey,
    referenceFile: env.I18NEXT_AI_TRANSLATOR_REFERENCE_FILE,
    bundleReferenceFolder: env.I18NEXT_AI_TRANSLATOR_BUNDLE_REFERENCE_FOLDER,
    configFile,
    defaultValue,
  };
}
