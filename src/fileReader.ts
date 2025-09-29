import fs from 'fs';
import path from 'path';
import { TranslationFile, UntranslatedKey } from './types';

export function readTranslationFiles(localesFolder: string): TranslationFile[] {
    if (!fs.existsSync(localesFolder)) {
      throw new Error(`Le dossier ${localesFolder} n'existe pas`);
    }
  
    const files = fs.readdirSync(localesFolder);
    
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const translationFiles: TranslationFile[] = [];
    
    for (const file of jsonFiles) {
      const filePath = path.join(localesFolder, file);
      const locale = path.basename(file, '.json'); 
      
      const content = fs.readFileSync(filePath, 'utf-8');
      const translations = JSON.parse(content);
      
      translationFiles.push({
        locale,
        filePath,
        translations
      });
    }
    
    return translationFiles;
  }

export function findUntranslatedKeys(
    translationFiles: TranslationFile[],
    untranslatedValue: string = '__STRING_NOT_TRANSLATED__'
  ): UntranslatedKey[] {
    const untranslatedKeys: UntranslatedKey[] = [];
    
    for (const file of translationFiles) {
      for (const [key, value] of Object.entries(file.translations)) {
        if (value === untranslatedValue) {
          untranslatedKeys.push({
            key,
            locale: file.locale,
            filePath: file.filePath
          });
        }
      }
    }
    
    return untranslatedKeys;
  }