export const AUTH_COOKIE = 'cies_auth';

/**
 * Constant-time string comparison in pure JS (no node:crypto).
 * Safe for Edge runtime.
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let acc = 0;
  for (let i = 0; i < a.length; i++) {
    acc |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return acc === 0;
}
