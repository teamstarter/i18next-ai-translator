import { readBundleReference } from '../readBundleReference';
import fs from 'fs';
import path from 'path';

const TEST_DIR = path.join(__dirname, '__test-bundle-references__');

describe('readBundleReference', () => {
  beforeEach(() => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  // Test 1 : read an existing reference file
  it('should read bundle reference file when it exists', () => {
    // GIVEN : un fichier de référence existe
    const referenceContent = 'This is the admin bundle reference documentation.';
    fs.writeFileSync(path.join(TEST_DIR, 'admin.md'), referenceContent);

    // WHEN : we read the reference file
    const result = readBundleReference(TEST_DIR, 'admin');

    // THEN : we should get the content of the file
    expect(result).toBe(referenceContent);
  });
  // Test 2 : return undefined if the file does not exist
  it('should return undefined when reference file does not exist', () => {
    const result = readBundleReference(TEST_DIR, 'nonexistent');

    expect(result).toBeUndefined();
  });
  // Test 3 : read different bundle reference files
  it('should read different bundle reference files', () => {
    const adminContent = 'Admin bundle documentation';
    const loginContent = 'Login bundle documentation';
    fs.writeFileSync(path.join(TEST_DIR, 'admin.md'), adminContent);
    fs.writeFileSync(path.join(TEST_DIR, 'login.md'), loginContent);

    const adminResult = readBundleReference(TEST_DIR, 'admin');
    const loginResult = readBundleReference(TEST_DIR, 'login');

    expect(adminResult).toBe(adminContent);
    expect(loginResult).toBe(loginContent);
  });
  // Test 4 : snapshot de différents scénarios
  it('should match snapshot for various scenarios', () => {
    fs.writeFileSync(path.join(TEST_DIR, 'admin.md'), 'Admin panel documentation');
    fs.writeFileSync(path.join(TEST_DIR, 'login.md'), 'Login flow documentation');
    fs.writeFileSync(path.join(TEST_DIR, 'default.md'), 'Default documentation');

    const results = {
      admin: readBundleReference(TEST_DIR, 'admin'),
      login: readBundleReference(TEST_DIR, 'login'),
      default: readBundleReference(TEST_DIR, 'default'),
      nonexistent: readBundleReference(TEST_DIR, 'nonexistent'),
    };

    expect(results).toMatchSnapshot();
  });
});
