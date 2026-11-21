/**
 * Prepends Vite's BASE_URL (e.g. "/vice-files/" on GitHub Pages) to public/ asset paths.
 */
export function assetUrl(path: string): string {
  const clean = path.replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}${clean}`;
}
