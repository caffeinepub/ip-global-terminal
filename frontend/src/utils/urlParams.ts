/**
 * URL parameter utilities.
 * Admin token gate has been removed — the app is fully publicly accessible.
 * getSecretParameter is kept as a no-op export to satisfy the useActor.ts import.
 */

/**
 * Previously returned a secret admin token from the URL hash or sessionStorage.
 * Now always returns null so no token is ever passed to the backend,
 * making the app fully publicly accessible without any token requirement.
 */
export function getSecretParameter(_paramName: string): string | null {
  return null;
}
