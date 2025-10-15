import { getBundleName } from '../getBundleName';

describe('getBundleName', () => {
  // Test 1 : format "bundle.locale.json"
  it('should extract bundle name from "bundle.locale.json" format', () => {
    // GIVEN : a file path with the format "bundle.locale.json"
    const filePath = '/locales/admin.fr.json';

    // WHEN : we extract the bundle name
    const result = getBundleName(filePath);

    // THEN : we should get the bundle name
    expect(result).toBe('admin');
  });

  // Test 2 : format "locale.json" without bundle
  it('should return "default" for "locale.json" format without bundle', () => {
    const filePath = '/locales/en.json';

    const result = getBundleName(filePath);

    expect(result).toBe('default');
  });

  // Test 3 : full path containing multiple directories
  it('should work with full path containing multiple directories', () => {
    const filePath = '/Users/dev/project/locales/admin.fr.json';

    const result = getBundleName(filePath);

    expect(result).toBe('admin');
  });

  // Test 4 : snapshot for various file formats
  it('should match snapshot for various file formats', () => {
    const testCases = [
      { filePath: '/locales/admin.fr.json', expected: 'admin' },
      { filePath: '/locales/login.en.json', expected: 'login' },
      { filePath: '/locales/platform.es.json', expected: 'platform' },
      { filePath: '/locales/fr.json', expected: 'default' },
      { filePath: '/locales/en.json', expected: 'default' },
      { filePath: '/Users/dev/project/locales/default.de.json', expected: 'default' },
    ];

    const results = testCases.map(testCase => ({
      filePath: testCase.filePath,
      bundleName: getBundleName(testCase.filePath),
    }));

    expect(results).toMatchSnapshot();
  });
});
