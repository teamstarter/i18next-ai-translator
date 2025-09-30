import { findUntranslatedKeys } from '../fileReader';
import { TranslationFile } from '../types';

describe('findUntranslatedKeys', () => {
  // Test 1 : find a single untranslated key
  it('should find a single untranslated key', () => {
    // create a test file
    const files: TranslationFile[] = [
      {
        locale: 'en',
        filePath: '/test/en.json',
        translations: {
          welcome: 'Welcome',
          login: '__STRING_NOT_TRANSLATED__',
        },
      },
    ];

    const result = findUntranslatedKeys(files);

    expect(result).toHaveLength(1);
    expect(result[0].keyPath).toEqual(['login']);
    expect(result[0].locale).toBe('en');
  });

  // Test 2 : find multiple untranslated keys
  it('should find multiple untranslated keys', () => {
    const files: TranslationFile[] = [
      {
        locale: 'en',
        filePath: '/test/en.json',
        translations: {
          welcome: 'Welcome',
          login: '__STRING_NOT_TRANSLATED__',
          logout: '__STRING_NOT_TRANSLATED__',
        },
      },
    ];

    const result = findUntranslatedKeys(files);

    expect(result).toHaveLength(2);
    expect(result[0].keyPath).toEqual(['login']);
    expect(result[1].keyPath).toEqual(['logout']);
  });

  // Test 3 : find untranslated key in nested object
  it('should find untranslated key in nested object', () => {
    const files: TranslationFile[] = [
      {
        locale: 'en',
        filePath: '/test/en.json',
        translations: {
          welcome: 'Welcome',
          profile: {
            title: '__STRING_NOT_TRANSLATED__',
          },
        },
      },
    ];

    const result = findUntranslatedKeys(files);

    expect(result).toHaveLength(1);
    expect(result[0].keyPath).toEqual(['profile', 'title']);
  });

  // Test 4 : find deeply nested untranslated key
  it('should find untranslated key deeply nested', () => {
    const files: TranslationFile[] = [
      {
        locale: 'en',
        filePath: '/test/en.json',
        translations: {
          profile: {
            settings: {
              privacy: '__STRING_NOT_TRANSLATED__',
            },
          },
        },
      },
    ];

    const result = findUntranslatedKeys(files);

    expect(result).toHaveLength(1);
    expect(result[0].keyPath).toEqual(['profile', 'settings', 'privacy']);
  });

  // Test 5 : no untranslated keys
  it('should return empty array when all keys are translated', () => {
    const files: TranslationFile[] = [
      {
        locale: 'fr',
        filePath: '/test/fr.json',
        translations: {
          welcome: 'Bienvenue',
          home: 'Accueil',
        },
      },
    ];

    const result = findUntranslatedKeys(files);

    expect(result).toEqual([]);
  });

  // Test 6 : multiple files with untranslated keys
  it('should find untranslated keys across multiple files', () => {
    const files: TranslationFile[] = [
      {
        locale: 'en',
        filePath: '/test/en.json',
        translations: {
          login: '__STRING_NOT_TRANSLATED__',
        },
      },
      {
        locale: 'es',
        filePath: '/test/es.json',
        translations: {
          logout: '__STRING_NOT_TRANSLATED__',
        },
      },
    ];

    const result = findUntranslatedKeys(files);

    expect(result).toHaveLength(2);
    expect(result[0].locale).toBe('en');
    expect(result[0].keyPath).toEqual(['login']);
    expect(result[1].locale).toBe('es');
    expect(result[1].keyPath).toEqual(['logout']);
  });

  // Test 7 : empty translation object
  it('should handle empty translation object', () => {
    const files: TranslationFile[] = [
      {
        locale: 'en',
        filePath: '/test/en.json',
        translations: {},
      },
    ];

    const result = findUntranslatedKeys(files);

    expect(result).toEqual([]);
  });

  // Test 8 : custom untranslated value
  it('should work with custom untranslated value', () => {
    const files: TranslationFile[] = [
      {
        locale: 'en',
        filePath: '/test/en.json',
        translations: {
          welcome: 'Welcome',
          login: 'CUSTOM_NOT_TRANSLATED',
        },
      },
    ];

    // pass our custom value as 2nd parameter
    const result = findUntranslatedKeys(files, 'CUSTOM_NOT_TRANSLATED');

    expect(result).toHaveLength(1);
    expect(result[0].keyPath).toEqual(['login']);
  });

  // Test 9 complex nested structure
  it('should match snapshot for complex nested structure', () => {
    const files: TranslationFile[] = [
      {
        locale: 'en',
        filePath: '/test/en.json',
        translations: {
          welcome: 'Welcome',
          login: '__STRING_NOT_TRANSLATED__',
          logout: '__STRING_NOT_TRANSLATED__',
          home: 'Home',
          profile: {
            title: '__STRING_NOT_TRANSLATED__',
            settings: {
              privacy: '__STRING_NOT_TRANSLATED__',
            },
          },
        },
      },
    ];

    const result = findUntranslatedKeys(files);

    //the complete structure of the found keys
    expect(result).toMatchSnapshot();
  });
});
