import fs from 'fs';
import path from 'path';
import { readTranslationFiles } from '../fileReader';

const TEST_DIR = path.join(__dirname, '__test-locales-read__');

describe('readTranslationFiles', () => {
  it('should read a single JSON translation file', () => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
    const enContent = { welcome: 'Welcome', home: 'Home' };
    fs.writeFileSync(path.join(TEST_DIR, 'en.json'), JSON.stringify(enContent));

    const result = readTranslationFiles(TEST_DIR);

    expect(result).toHaveLength(1);
    expect(result[0].locale).toBe('en');
    expect(result[0].translations).toEqual(enContent);

    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it('should read multiple JSON translation files', () => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
    fs.writeFileSync(path.join(TEST_DIR, 'en.json'), JSON.stringify({ key: 'English' }));
    fs.writeFileSync(path.join(TEST_DIR, 'fr.json'), JSON.stringify({ key: 'Français' }));

    const result = readTranslationFiles(TEST_DIR);

    expect(result).toHaveLength(2);
    expect(result.map(f => f.locale)).toContain('en');
    expect(result.map(f => f.locale)).toContain('fr');

    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it('should ignore non-JSON files', () => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
    fs.writeFileSync(path.join(TEST_DIR, 'en.json'), JSON.stringify({ key: 'value' }));
    fs.writeFileSync(path.join(TEST_DIR, 'readme.txt'), 'Some text');

    const result = readTranslationFiles(TEST_DIR);

    expect(result).toHaveLength(1);
    expect(result[0].locale).toBe('en');

    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it('should return empty array when folder is empty', () => {
    fs.mkdirSync(TEST_DIR, { recursive: true });

    const result = readTranslationFiles(TEST_DIR);

    expect(result).toEqual([]);

    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it('should throw error when folder does not exist', () => {
    const nonExistentPath = path.join(TEST_DIR, 'does-not-exist');

    expect(() => readTranslationFiles(nonExistentPath)).toThrow(
      `The folder ${nonExistentPath} does not exist`
    );
  });

  it('should include correct file path in result', () => {
    // Préparer
    fs.mkdirSync(TEST_DIR, { recursive: true });
    fs.writeFileSync(path.join(TEST_DIR, 'en.json'), JSON.stringify({ key: 'value' }));

    const result = readTranslationFiles(TEST_DIR);

    expect(result[0].filePath).toBe(path.join(TEST_DIR, 'en.json'));

    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it('should match snapshot for translation files structure', () => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
    const content = {
      welcome: 'Welcome',
      nested: {
        key: 'value',
      },
    };
    fs.writeFileSync(path.join(TEST_DIR, 'en.json'), JSON.stringify(content));

    const result = readTranslationFiles(TEST_DIR);

    expect(result).toHaveLength(1);
    expect(result[0].filePath).toBe(path.join(TEST_DIR, 'en.json'));

    expect({
      locale: result[0].locale,
      translations: result[0].translations,
    }).toMatchSnapshot();

    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });
});
