import { base } from '$app/paths';

/**
 * Get the correct asset path for static files, accounting for the base path
 * @param path - The asset path starting with /
 * @returns The full asset path with base path included
 */
export function getAssetPath(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}/${cleanPath}`;
} 