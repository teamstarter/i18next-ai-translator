import dotenv from 'dotenv';
import { Config } from './types';

dotenv.config();

export function loadConfig(): Config {
    const apiKey = process.env.I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY;
    
   
    if (!apiKey) {
      throw new Error(
        'Clé API manquante !\n' +
        'Définissez la variable I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY\n' +
        'Exemple: export I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY=votre-clé\n' +
        'Ou utilisez un fichier .env'
      );
    }
    
    return {
      apiKey,
      referenceFile: process.env.I18NEXT_AI_TRANSLATOR_REFERENCE_FILE,
      bundleReferenceFolder: process.env.I18NEXT_AI_TRANSLATOR_BUNDLE_REFERENCE_FOLDER,
      configFile: process.env.I18NEXT_AI_TRANSLATOR_CONFIG,
    };
  }