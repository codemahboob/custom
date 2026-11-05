/** Exponential retry delay for durable Instagram message jobs. */
export function retryDelayMs(attempts) {
  const attempt = Math.max(1, Math.min(7, Math.floor(Number(attempts) || 1)));
  return Math.min(300000, 5000 * (2 ** (attempt - 1)));
}

/** Jobs are moved to failed after the configured maximum number of attempts. */
export function isTerminalAttempt(attempts, maxAttempts = 8) {
  return Number(attempts) >= maxAttempts;
}
