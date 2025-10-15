import path from 'path';

/**
 * Extract the bundle name from the file path
 * @param filePath - File path (ex: "/locales/admin.fr.json")
 * @returns The bundle name (ex: "admin")
 */
export function getBundleName(filePath: string): string {
  const fileName = path.basename(filePath, '.json');

  const parts = fileName.split('.');

  if (parts.length > 1) {
    return parts[0];
  }

  return 'default';
}
