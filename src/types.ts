export interface Config {
  apiKey: string;
  referenceFile?: string;
  bundleReferenceFolder?: string;
  configFile?: string;
  defaultValue: string; 
}
export interface UntranslatedKey {
  keyPath: string[];
  locale: string;
  filePath: string;
}

export interface TranslationFile {
  locale: string;
  filePath: string;
  translations: Record<string, unknown>;
}
