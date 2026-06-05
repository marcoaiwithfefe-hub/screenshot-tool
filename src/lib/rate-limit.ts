// In-memory global token bucket — not per-IP (no reliable client IP without a proxy).
// Survives Next.js dev hot-reloads via globalThis singleton pattern.

const CAPACITY = 20; // burst — kept above the concurrency semaphore's cap of 12
const REFILL_TOKENS = 60; // tokens added per interval
const REFILL_INTERVAL_MS = 60_000; // 60 seconds → sustained rate 60/min
const REFILL_PER_MS = REFILL_TOKENS / REFILL_INTERVAL_MS;

interface BucketState {
  tokens: number;
  lastRefill: number;
}

const g = globalThis as unknown as { __cies_rate_bucket?: BucketState };

const bucket: BucketState =
  g.__cies_rate_bucket ??
  (g.__cies_rate_bucket = { tokens: CAPACITY, lastRefill: Date.now() });

export function takeCaptureToken(): boolean {
  const now = Date.now();
  const elapsed = now - bucket.lastRefill;
  bucket.tokens = Math.min(CAPACITY, bucket.tokens + elapsed * REFILL_PER_MS);
  bucket.lastRefill = now;
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return true;
  }
  return false;
}
