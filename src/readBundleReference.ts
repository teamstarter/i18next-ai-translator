import fs from 'fs';
import path from 'path';
import debug from 'debug';

const log = debug('i18next-ai-translator:readBundleReference');

/**
 * Read the reference file of a specific bundle
 * @param bundleReferenceFolder - Folder containing the reference files
 * @param bundleName - Bundle name (ex: 'admin', 'login')
 * @returns The content of the reference file, or undefined if the file does not exist
 */
export function readBundleReference(
  bundleReferenceFolder: string,
  bundleName: string
): string | undefined {
  log('Reading bundle reference for: %s', bundleName);

  const referencePath = path.join(bundleReferenceFolder, `${bundleName}.md`);
  log('Reference path: %s', referencePath);

  if (fs.existsSync(referencePath)) {
    log('Reference file found, reading content');
    const content = fs.readFileSync(referencePath, 'utf-8');
    log('Reference content length: %d characters', content.length);
    return content;
  }

  log('Reference file not found, returning undefined');
  return undefined;
}
