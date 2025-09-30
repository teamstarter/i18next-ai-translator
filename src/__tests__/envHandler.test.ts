import { loadConfig } from '../envHandler';

describe('envHandler', () => {
  describe('loadConfig', () => {
    // Test 1 : all config values are set
    it('should load all config values when all env variables are set', () => {
      const mockEnv = {
        I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY: 'test-api-key-123',
        I18NEXT_AI_TRANSLATOR_REFERENCE_FILE: './docs/reference.md',
        I18NEXT_AI_TRANSLATOR_BUNDLE_REFERENCE_FOLDER: './docs/bundles/',
        I18NEXT_AI_TRANSLATOR_CONFIG: './config/i18next.config.js',
      };

      const result = loadConfig(mockEnv);

      expect(result).toEqual({
        apiKey: 'test-api-key-123',
        referenceFile: './docs/reference.md',
        bundleReferenceFolder: './docs/bundles/',
        configFile: './config/i18next.config.js',
      });
    });

    // Test 2 : only apiKey is set
    it('should load config with only apiKey when optional variables are missing', () => {
      const mockEnv = {
        I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY: 'test-api-key-456',
      };

      const result = loadConfig(mockEnv);

      expect(result).toEqual({
        apiKey: 'test-api-key-456',
        referenceFile: undefined,
        bundleReferenceFolder: undefined,
        configFile: undefined,
      });
    });

    // Test 3 : apiKey is missing
    it('should throw an error when API key is missing', () => {
      const mockEnv = {};

      expect(() => loadConfig(mockEnv)).toThrow(
        'API key missing !\n' +
          'Set the variable I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY\n' +
          'Example: export I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY=your-key\n' +
          'Or use a .env file'
      );
    });

    // Test 4 : apiKey is an empty string
    it('should throw an error when API key is empty string', () => {
      const mockEnv = {
        I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY: '',
      };

      expect(() => loadConfig(mockEnv)).toThrow('API key missing');
    });

    // Test 5 : apiKey is explicitly undefined
    it('should throw an error when API key is explicitly undefined', () => {
      const mockEnv = {
        I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY: undefined,
      };

      expect(() => loadConfig(mockEnv)).toThrow('API key missing');
    });

    // Test 6 : Snapshot - all values are set
    it('should match snapshot with all values', () => {
      const mockEnv = {
        I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY: 'snapshot-key',
        I18NEXT_AI_TRANSLATOR_REFERENCE_FILE: './reference.md',
        I18NEXT_AI_TRANSLATOR_BUNDLE_REFERENCE_FOLDER: './bundles/',
        I18NEXT_AI_TRANSLATOR_CONFIG: './config.js',
      };

      const result = loadConfig(mockEnv);
      expect(result).toMatchSnapshot();
    });
  });
});
