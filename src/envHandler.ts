import dotenv from 'dotenv';
import { Config } from './types';

dotenv.config();

export function loadConfig(): Config {
    const apiKey = process.env.I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY;
    
   
    if (!apiKey) {
      throw new Error(
        'API key missing !\n' +
        'Set the variable I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY\n' +
        'Example: export I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY=your-key\n' +
        'Or use a .env file'
      );
    }
    
    return {
      apiKey,
      referenceFile: process.env.I18NEXT_AI_TRANSLATOR_REFERENCE_FILE,
      bundleReferenceFolder: process.env.I18NEXT_AI_TRANSLATOR_BUNDLE_REFERENCE_FOLDER,
      configFile: process.env.I18NEXT_AI_TRANSLATOR_CONFIG,
    };
  }