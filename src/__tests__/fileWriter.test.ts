import fs from 'fs';
import path from 'path';
import { writeTranslation } from '../fileWriter';

const TEST_DIR = path.join(__dirname, '__test-locales-write__');

describe('writeTranslation', () => {
  beforeEach(() => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  // Test 1 : translate a simple key at root level
  it('should translate a simple key at root level', () => {
    // GIVEN : a json file with an untranslated key
    const filePath = path.join(TEST_DIR, 'en.json');
    const initialContent = {
      welcome: 'Welcome',
      login: '__STRING_NOT_TRANSLATED__',
      home: 'Home',
    };
    fs.writeFileSync(filePath, JSON.stringify(initialContent, null, 2));

    // WHEN : we translate the "login" key
    writeTranslation(filePath, ['login'], 'Log in');

    // THEN : the file should contain the translation
    const updatedContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    expect(updatedContent.login).toBe('Log in');
    // The other keys should not be modified
    expect(updatedContent.welcome).toBe('Welcome');
    expect(updatedContent.home).toBe('Home');
  });
  // Test 2 : translate a nested key (1 level)
  it('should translate a nested key (1 level)', () => {
    // GIVEN : a file with a nested key
    const filePath = path.join(TEST_DIR, 'en.json');
    const initialContent = {
      welcome: 'Welcome',
      profile: {
        title: '__STRING_NOT_TRANSLATED__',
      },
    };
    fs.writeFileSync(filePath, JSON.stringify(initialContent, null, 2));

    // WHEN : we translate the nested key
    writeTranslation(filePath, ['profile', 'title'], 'Profile');

    // THEN : the file should contain the translation
    const updatedContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    expect(updatedContent.profile.title).toBe('Profile');
    // The other keys should not be modified
    expect(updatedContent.welcome).toBe('Welcome');
  });
  // Test 3 : translate a deeply nested key
  it('should translate a deeply nested key', () => {
    // GIVEN : a file with a deeply nested key
    const filePath = path.join(TEST_DIR, 'en.json');
    const initialContent = {
      welcome: 'Welcome',
      profile: {
        settings: {
          privacy: '__STRING_NOT_TRANSLATED__',
        },
      },
    };
    fs.writeFileSync(filePath, JSON.stringify(initialContent, null, 2));

    // WHEN : we translate the deeply nested key
    writeTranslation(filePath, ['profile', 'settings', 'privacy'], 'Privacy');

    // THEN : the file should contain the translation
    const updatedContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    expect(updatedContent.profile.settings.privacy).toBe('Privacy');
    // The other keys should not be modified
    expect(updatedContent.welcome).toBe('Welcome');
  });
  // Test 4 : other keys are not modified
  it('should not modify other keys when translating one key', () => {
    // GIVEN : un fichier avec plusieurs clés
    const filePath = path.join(TEST_DIR, 'fr.json');
    const initialContent = {
      welcome: 'Bienvenue',
      login: '__STRING_NOT_TRANSLATED__',
      logout: 'Se déconnecter',
      home: 'Accueil',
      profile: {
        title: 'Profil',
        settings: {
          privacy: 'Confidentialité',
        },
      },
    };
    fs.writeFileSync(filePath, JSON.stringify(initialContent, null, 2));

    // WHEN : we translate only the "login" key
    writeTranslation(filePath, ['login'], 'Se connecter');

    // THEN : all other keys should remain the same
    const updatedContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    expect(updatedContent.login).toBe('Se connecter');
    // Verify that nothing else has changed
    expect(updatedContent.welcome).toBe('Bienvenue');
    expect(updatedContent.logout).toBe('Se déconnecter');
    expect(updatedContent.home).toBe('Accueil');
    expect(updatedContent.profile.title).toBe('Profil');
    expect(updatedContent.profile.settings.privacy).toBe('Confidentialité');
  });
  // Test 5 : throw error if file does not exist
  it('should throw error when file does not exist', () => {
    // GIVEN : a non-existent file path
    const nonExistentPath = path.join(TEST_DIR, 'does-not-exist.json');

    // WHEN + THEN : calling the function should throw an error
    expect(() => {
      writeTranslation(nonExistentPath, ['login'], 'Log in');
    }).toThrow(`File does not exist: ${nonExistentPath}`);
  });
  // Test 6 : preserve JSON indentation
  it('should preserve JSON indentation when writing', () => {
    // GIVEN : a file with 2 spaces indentation
    const filePath = path.join(TEST_DIR, 'en.json');
    const initialContent = {
      welcome: 'Welcome',
      login: '__STRING_NOT_TRANSLATED__',
    };
    fs.writeFileSync(filePath, JSON.stringify(initialContent, null, 2));

    // WHEN : we translate a key
    writeTranslation(filePath, ['login'], 'Log in');

    // THEN : the file should keep its indentation
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Verify that the file contains new lines (well formatted)
    expect(fileContent).toContain('\n');
    // Verify that it contains indentations (2 spaces)
    expect(fileContent).toContain('  ');
    // Verify the expected structure
    expect(fileContent).toContain('"login": "Log in"');
  });
});
