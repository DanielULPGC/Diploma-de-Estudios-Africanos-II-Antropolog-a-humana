/**
 * Resolves a static asset path relative to Vite's configured BASE_URL so local
 * assets load reliably both in dev ("/") and on subpath hosts like GitHub Pages ("./").
 */
export function resolveAssetUrl(assetPath: string): string {
  const base = import.meta.env.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${assetPath.replace(/^\/+/, '')}`;
}
