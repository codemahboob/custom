import test from 'node:test';
import assert from 'node:assert/strict';
import { retryDelayMs, isTerminalAttempt } from '../message-queue-utils.js';

test('message queue retry delay uses bounded exponential backoff', () => {
  assert.equal(retryDelayMs(1), 5000);
  assert.equal(retryDelayMs(2), 10000);
  assert.equal(retryDelayMs(3), 20000);
  assert.equal(retryDelayMs(7), 300000);
  assert.equal(retryDelayMs(99), 300000);
});

test('message queue terminal attempt threshold is explicit', () => {
  assert.equal(isTerminalAttempt(7), false);
  assert.equal(isTerminalAttempt(8), true);
  assert.equal(isTerminalAttempt(3, 3), true);
});
