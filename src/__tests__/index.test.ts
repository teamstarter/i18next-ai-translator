import { run } from '../index';
import { loadConfig } from '../envHandler';
import { readTranslationFiles, findUntranslatedKeys } from '../fileReader';
import { processTranslations } from '../processTranslations';
import fs from 'fs';

jest.mock('../envHandler');
jest.mock('../fileReader');
jest.mock('../processTranslations');
jest.mock('fs');

describe('run', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (loadConfig as jest.Mock).mockReset();
    (readTranslationFiles as jest.Mock).mockReset();
    (findUntranslatedKeys as jest.Mock).mockReset();
    (processTranslations as jest.Mock).mockReset();
    (fs.existsSync as jest.Mock).mockReset();
    (fs.readFileSync as jest.Mock).mockReset();
  });

  // Test 1 : no untranslated keys found
  it('should return success when no untranslated keys found', async () => {
    (loadConfig as jest.Mock).mockReturnValue({
      apiKey: 'test-api-key',
    });
    (readTranslationFiles as jest.Mock).mockReturnValue([]);
    (findUntranslatedKeys as jest.Mock).mockReturnValue([]);

    const result = await run('/locales');

    expect(readTranslationFiles).toHaveBeenCalledWith('/locales');
    expect(findUntranslatedKeys).toHaveBeenCalled();
    expect(processTranslations).not.toHaveBeenCalled();
    expect(result).toEqual({ success: 0, failed: 0 });
  });
  // Test 2 : translate untranslated keys
  it('should translate untranslated keys successfully', async () => {
    (loadConfig as jest.Mock).mockReturnValue({
      apiKey: 'test-api-key',
    });

    const mockFiles = [
      {
        locale: 'fr',
        filePath: '/locales/fr.json',
        translations: { login: '__STRING_NOT_TRANSLATED__' },
      },
    ];

    const mockUntranslatedKeys = [
      {
        keyPath: ['login'],
        locale: 'fr',
        filePath: '/locales/fr.json',
      },
    ];

    (readTranslationFiles as jest.Mock).mockReturnValue(mockFiles);
    (findUntranslatedKeys as jest.Mock).mockReturnValue(mockUntranslatedKeys);
    (processTranslations as jest.Mock).mockResolvedValue({ success: 1, failed: 0 });

    const result = await run('/locales');

    expect(processTranslations).toHaveBeenCalledWith(
      mockUntranslatedKeys,
      'test-api-key',
      undefined,
      undefined
    );
    expect(result).toEqual({ success: 1, failed: 0 });
  });
  // Test 3 : use global reference file
  it('should use global reference file when provided', async () => {
    (loadConfig as jest.Mock).mockReturnValue({
      apiKey: 'test-api-key',
      referenceFile: '/docs/reference.md',
    });

    const mockUntranslatedKeys = [
      {
        keyPath: ['login'],
        locale: 'fr',
        filePath: '/locales/fr.json',
      },
    ];

    (readTranslationFiles as jest.Mock).mockReturnValue([]);
    (findUntranslatedKeys as jest.Mock).mockReturnValue(mockUntranslatedKeys);
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('Global reference content');
    (processTranslations as jest.Mock).mockResolvedValue({ success: 1, failed: 0 });

    const result = await run('/locales');

    expect(fs.existsSync).toHaveBeenCalledWith('/docs/reference.md');
    expect(fs.readFileSync).toHaveBeenCalledWith('/docs/reference.md', 'utf-8');
    expect(processTranslations).toHaveBeenCalledWith(
      mockUntranslatedKeys,
      'test-api-key',
      'Global reference content',
      undefined
    );
    expect(result).toEqual({ success: 1, failed: 0 });
  });
  // Test 4 : use bundle reference folder
  it('should pass bundleReferenceFolder to processTranslations', async () => {
    (loadConfig as jest.Mock).mockReturnValue({
      apiKey: 'test-api-key',
      bundleReferenceFolder: '/docs/bundles',
    });

    const mockUntranslatedKeys = [
      {
        keyPath: ['login'],
        locale: 'fr',
        filePath: '/locales/admin.fr.json',
      },
    ];

    (readTranslationFiles as jest.Mock).mockReturnValue([]);
    (findUntranslatedKeys as jest.Mock).mockReturnValue(mockUntranslatedKeys);
    (processTranslations as jest.Mock).mockResolvedValue({ success: 1, failed: 0 });

    const result = await run('/locales');

    expect(processTranslations).toHaveBeenCalledWith(
      mockUntranslatedKeys,
      'test-api-key',
      undefined,
      '/docs/bundles'
    );
    expect(result).toEqual({ success: 1, failed: 0 });
  });
  // Test 5 : reference file configured but not existent
  it('should not use reference file when it does not exist', async () => {
    (loadConfig as jest.Mock).mockReturnValue({
      apiKey: 'test-api-key',
      referenceFile: '/docs/nonexistent.md',
    });

    const mockUntranslatedKeys = [
      {
        keyPath: ['login'],
        locale: 'fr',
        filePath: '/locales/fr.json',
      },
    ];

    (readTranslationFiles as jest.Mock).mockReturnValue([]);
    (findUntranslatedKeys as jest.Mock).mockReturnValue(mockUntranslatedKeys);
    (fs.existsSync as jest.Mock).mockReturnValue(false); // Le fichier n'existe pas
    (processTranslations as jest.Mock).mockResolvedValue({ success: 1, failed: 0 });

    const result = await run('/locales');

    expect(fs.existsSync).toHaveBeenCalledWith('/docs/nonexistent.md');
    expect(fs.readFileSync).not.toHaveBeenCalled();
    expect(processTranslations).toHaveBeenCalledWith(
      mockUntranslatedKeys,
      'test-api-key',
      undefined, 
      undefined
    );
    expect(result).toEqual({ success: 1, failed: 0 });
  });
  // Test 6 : Snapshot for complete workflow
  it('should match snapshot for complete workflow', async () => {
    (loadConfig as jest.Mock).mockReturnValue({
      apiKey: 'test-api-key',
      referenceFile: '/docs/reference.md',
      bundleReferenceFolder: '/docs/bundles',
    });

    const mockFiles = [
      {
        locale: 'fr',
        filePath: '/locales/admin.fr.json',
        translations: { login: '__STRING_NOT_TRANSLATED__' },
      },
    ];

    const mockUntranslatedKeys = [
      {
        keyPath: ['login'],
        locale: 'fr',
        filePath: '/locales/admin.fr.json',
      },
    ];

    (readTranslationFiles as jest.Mock).mockReturnValue(mockFiles);
    (findUntranslatedKeys as jest.Mock).mockReturnValue(mockUntranslatedKeys);
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('Reference content');
    (processTranslations as jest.Mock).mockResolvedValue({ success: 1, failed: 0 });

    const result = await run('/locales');

    const workflow = {
      result,
      processTranslationsCalled: (processTranslations as jest.Mock).mock.calls[0],
    };

    expect(workflow).toMatchSnapshot();
  });
});
