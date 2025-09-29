export interface Config {
    apiKey: string;
    referenceFile?: string;
    bundleReferenceFolder?: string;
    configFile?: string;
  }
  export interface UntranslatedKey {
    key: string;
    locale: string;
    filePath: string;
  }

  export interface TranslationFile {
    locale: string;
    filePath: string;
    translations: Record<string, any>;
  }
