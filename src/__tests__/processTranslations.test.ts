import { processTranslations } from '../processTranslations';
import { translateKey } from '../translator';
import { writeTranslation } from '../fileWriter';
import { getBundleName } from '../getBundleName';
import { readBundleReference } from '../readBundleReference';
import { UntranslatedKey } from '../types';

jest.mock('../translator');
jest.mock('../fileWriter');
jest.mock('../getBundleName');
jest.mock('../readBundleReference');

describe('processTranslations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (translateKey as jest.Mock).mockReset();
    (writeTranslation as jest.Mock).mockReset();
  });
  // Test 1 : return success=0 and failed=0 when given empty array
  it('should return success=0 and failed=0 when given empty array', async () => {
    // GIVEN : an empty array of untranslated keys
    const untranslatedKeys: UntranslatedKey[] = [];
    const apiKey = 'fake-api-key';

    // WHEN : we call processTranslations
    const result = await processTranslations(untranslatedKeys, apiKey);

    // THEN : we should have 0 success and 0 failure, without calling the dependencies
    expect(result).toEqual({ success: 0, failed: 0 });
    expect(translateKey).not.toHaveBeenCalled();
    expect(writeTranslation).not.toHaveBeenCalled();
  });
  // Test 2 : translate a single key at root level
  it('should translate a single key at root level', async () => {
    const untranslatedKeys: UntranslatedKey[] = [
      {
        keyPath: ['login'],
        locale: 'fr',
        filePath: '/test/fr.json',
      },
    ];
    const apiKey = 'fake-api-key';

    (translateKey as jest.Mock).mockResolvedValue('Se connecter');

    const result = await processTranslations(untranslatedKeys, apiKey);

    expect(result).toEqual({ success: 1, failed: 0 });
    expect(translateKey).toHaveBeenCalledTimes(1);
    expect(translateKey).toHaveBeenCalledWith('login', 'fr', 'fake-api-key', undefined);
    expect(writeTranslation).toHaveBeenCalledTimes(1);
    expect(writeTranslation).toHaveBeenCalledWith('/test/fr.json', ['login'], 'Se connecter');
  });
  // Test 3 : translate multiple keys
  it('should translate multiple keys', async () => {
    const untranslatedKeys: UntranslatedKey[] = [
      {
        keyPath: ['login'],
        locale: 'fr',
        filePath: '/test/fr.json',
      },
      {
        keyPath: ['logout'],
        locale: 'fr',
        filePath: '/test/fr.json',
      },
      {
        keyPath: ['home'],
        locale: 'fr',
        filePath: '/test/fr.json',
      },
    ];
    const apiKey = 'fake-api-key';

    (translateKey as jest.Mock)
      .mockResolvedValueOnce('Se connecter')
      .mockResolvedValueOnce('Se déconnecter')
      .mockResolvedValueOnce('Accueil');

    const result = await processTranslations(untranslatedKeys, apiKey);

    expect(result).toEqual({ success: 3, failed: 0 });
    expect(translateKey).toHaveBeenCalledTimes(3);
    expect(writeTranslation).toHaveBeenCalledTimes(3);

    // Verify the order of calls
    expect(translateKey).toHaveBeenNthCalledWith(1, 'login', 'fr', 'fake-api-key', undefined);
    expect(translateKey).toHaveBeenNthCalledWith(2, 'logout', 'fr', 'fake-api-key', undefined);
    expect(translateKey).toHaveBeenNthCalledWith(3, 'home', 'fr', 'fake-api-key', undefined);
  });
  // Test 4 : translate a nested key
  it('should translate a nested key', async () => {
    const untranslatedKeys: UntranslatedKey[] = [
      {
        keyPath: ['profile', 'title'],
        locale: 'fr',
        filePath: '/test/fr.json',
      },
    ];
    const apiKey = 'fake-api-key';

    (translateKey as jest.Mock).mockResolvedValue('Profil');

    const result = await processTranslations(untranslatedKeys, apiKey);

    expect(result).toEqual({ success: 1, failed: 0 });
    expect(translateKey).toHaveBeenCalledWith('title', 'fr', 'fake-api-key', undefined);
    expect(writeTranslation).toHaveBeenCalledWith('/test/fr.json', ['profile', 'title'], 'Profil');
  });
  // Test 5 : handle translation error
  it('should handle translation error and continue with other keys', async () => {
    const untranslatedKeys: UntranslatedKey[] = [
      {
        keyPath: ['login'],
        locale: 'fr',
        filePath: '/test/fr.json',
      },
      {
        keyPath: ['logout'],
        locale: 'fr',
        filePath: '/test/fr.json',
      },
      {
        keyPath: ['home'],
        locale: 'fr',
        filePath: '/test/fr.json',
      },
    ];
    const apiKey = 'fake-api-key';

    (translateKey as jest.Mock)
      .mockResolvedValueOnce('Se connecter')
      .mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValueOnce('Accueil');

    const result = await processTranslations(untranslatedKeys, apiKey);

    expect(result).toEqual({ success: 2, failed: 1 });
    expect(translateKey).toHaveBeenCalledTimes(3);
    // writeTranslation is called only 2 times (not for the one that failed)
    expect(writeTranslation).toHaveBeenCalledTimes(2);
  });
  // Test 6 : handle write error
  it('should handle write error and count as failed', async () => {
    const untranslatedKeys: UntranslatedKey[] = [
      {
        keyPath: ['login'],
        locale: 'fr',
        filePath: '/test/fr.json',
      },
    ];
    const apiKey = 'fake-api-key';

    (translateKey as jest.Mock).mockResolvedValue('Se connecter');
    (writeTranslation as jest.Mock).mockImplementation(() => {
      throw new Error('File write error');
    });

    const result = await processTranslations(untranslatedKeys, apiKey);

    expect(result).toEqual({ success: 0, failed: 1 });
    expect(translateKey).toHaveBeenCalledTimes(1);
    expect(writeTranslation).toHaveBeenCalledTimes(1);
  });
  // Test 7 : translate keys in multiple locales
  it('should translate keys in multiple locales', async () => {
    const untranslatedKeys: UntranslatedKey[] = [
      {
        keyPath: ['login'],
        locale: 'fr',
        filePath: '/test/fr.json',
      },
      {
        keyPath: ['login'],
        locale: 'es',
        filePath: '/test/es.json',
      },
      {
        keyPath: ['login'],
        locale: 'de',
        filePath: '/test/de.json',
      },
    ];
    const apiKey = 'fake-api-key';

    (translateKey as jest.Mock)
      .mockResolvedValueOnce('Se connecter')
      .mockResolvedValueOnce('Iniciar sesión')
      .mockResolvedValueOnce('Anmelden');

    const result = await processTranslations(untranslatedKeys, apiKey);

    expect(result).toEqual({ success: 3, failed: 0 });
    expect(translateKey).toHaveBeenNthCalledWith(1, 'login', 'fr', 'fake-api-key', undefined);
    expect(translateKey).toHaveBeenNthCalledWith(2, 'login', 'es', 'fake-api-key', undefined);
    expect(translateKey).toHaveBeenNthCalledWith(3, 'login', 'de', 'fake-api-key', undefined);
  });
  // Test 8 : translate with a global reference context
  it('should use reference context when provided', async () => {
    const untranslatedKeys: UntranslatedKey[] = [
      {
        keyPath: ['login'],
        locale: 'fr',
        filePath: '/test/fr.json',
      },
    ];
    const apiKey = 'fake-api-key';
    const referenceContext = 'This is a professional banking platform for business users.';

    (translateKey as jest.Mock).mockResolvedValue('Se connecter');

    const result = await processTranslations(untranslatedKeys, apiKey, referenceContext);

    expect(result).toEqual({ success: 1, failed: 0 });
    expect(translateKey).toHaveBeenCalledWith('login', 'fr', 'fake-api-key', referenceContext);
  });
  // Test 9 : translate with a bundle-specific reference
  it('should use bundle-specific reference when available', async () => {
    const untranslatedKeys: UntranslatedKey[] = [
      {
        keyPath: ['login'],
        locale: 'fr',
        filePath: '/locales/admin.fr.json',
      },
    ];
    const apiKey = 'fake-api-key';
    const bundleReferenceFolder = '/docs/bundles';

    (getBundleName as jest.Mock).mockReturnValue('admin');

    (readBundleReference as jest.Mock).mockReturnValue('Admin panel context');

    (translateKey as jest.Mock).mockResolvedValue('Se connecter');

    const result = await processTranslations(
      untranslatedKeys,
      apiKey,
      undefined,
      bundleReferenceFolder
    );

    expect(result).toEqual({ success: 1, failed: 0 });
    expect(getBundleName).toHaveBeenCalledWith('/locales/admin.fr.json');
    expect(readBundleReference).toHaveBeenCalledWith('/docs/bundles', 'admin');
    expect(translateKey).toHaveBeenCalledWith('login', 'fr', 'fake-api-key', 'Admin panel context');
  });
  // Test 10 : prioritize bundle-specific context over global context
  it('should prioritize bundle-specific context over global context', async () => {
    const untranslatedKeys: UntranslatedKey[] = [
      {
        keyPath: ['login'],
        locale: 'fr',
        filePath: '/locales/admin.fr.json',
      },
    ];
    const apiKey = 'fake-api-key';
    const globalContext = 'Global reference context';
    const bundleReferenceFolder = '/docs/bundles';

    (getBundleName as jest.Mock).mockReturnValue('admin');

    (readBundleReference as jest.Mock).mockReturnValue('Admin bundle specific context');

    (translateKey as jest.Mock).mockResolvedValue('Se connecter');

    const result = await processTranslations(
      untranslatedKeys,
      apiKey,
      globalContext,
      bundleReferenceFolder
    );

    expect(result).toEqual({ success: 1, failed: 0 });
    expect(translateKey).toHaveBeenCalledWith(
      'login',
      'fr',
      'fake-api-key',
      'Admin bundle specific context' // Le contexte bundle, PAS le global
    );
  });
});
