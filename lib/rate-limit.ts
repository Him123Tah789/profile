const requestLog = new Map<string, number[]>();

export function isRateLimited(key: string, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const hits = requestLog.get(key) || [];
  const validHits = hits.filter((t) => now - t < windowMs);

  if (validHits.length >= limit) {
    requestLog.set(key, validHits);
    return true;
  }

  validHits.push(now);
  requestLog.set(key, validHits);
  return false;
}
