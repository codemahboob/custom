import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  safeEqual,
  verifyMetaWebhookSignature,
  normalizeInstagramMessageEvents,
  isCapturedInrPayment,
} from '../webhook-utils.js';

test('safeEqual compares non-empty UTF-8 strings without coercion bugs', () => {
  assert.equal(safeEqual('token-123', 'token-123'), true);
  assert.equal(safeEqual('token-123', 'token-124'), false);
  assert.equal(safeEqual('', ''), false);
  assert.equal(safeEqual('é', 'e'), false);
});

test('Meta webhook signature validates the exact raw request bytes', () => {
  const raw = Buffer.from('{"object":"instagram","entry":[]}', 'utf8');
  const secret = 'unit-test-app-secret';
  const digest = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  assert.equal(verifyMetaWebhookSignature(raw, 'sha256=' + digest, secret), true);
  assert.equal(verifyMetaWebhookSignature(raw, 'sha256=' + digest.toUpperCase(), secret), true);
  assert.equal(verifyMetaWebhookSignature(Buffer.from(raw.toString() + ' '), 'sha256=' + digest, secret), false);
});

test('Meta webhook signature rejects missing, malformed, and wrong secrets', () => {
  const raw = Buffer.from('payload');
  const digest = crypto.createHmac('sha256', 'right-secret').update(raw).digest('hex');
  assert.equal(verifyMetaWebhookSignature(raw, '', 'right-secret'), false);
  assert.equal(verifyMetaWebhookSignature(raw, 'sha1=' + digest, 'right-secret'), false);
  assert.equal(verifyMetaWebhookSignature(raw, 'sha256=bad', 'right-secret'), false);
  assert.equal(verifyMetaWebhookSignature(raw, 'sha256=' + digest, 'wrong-secret'), false);
  assert.equal(verifyMetaWebhookSignature(null, 'sha256=' + digest, 'right-secret'), false);
});

test('normalizes standard Instagram messaging events and ignores echoes', () => {
  const result = normalizeInstagramMessageEvents({
    object: 'instagram',
    entry: [{
      id: '17841451027537139',
      messaging: [
        { sender: { id: '12345' }, timestamp: 1793710000000, message: { mid: 'm1', text: 'Hello' } },
        { sender: { id: '17841451027537139' }, message: { mid: 'm2', text: 'Echo', is_echo: true } },
        { sender: { id: '12345' }, message: { text: 'No ID' } },
      ],
    }],
  });
  assert.equal(result.messagingEvents.length, 3);
  assert.equal(result.events.length, 1);
  assert.equal(result.events[0].message.text, 'Hello');
  assert.deepEqual(result.ignored, { noMessage: 0, echo: 1, missingSender: 0, missingMessageId: 1 });
});

test('normalizes complete message payloads in changes.value', () => {
  const result = normalizeInstagramMessageEvents({
    object: 'instagram',
    entry: [{
      changes: [{
        field: 'messages',
        value: {
          sender: { id: '12345' },
          timestamp: 1793710000000,
          message: { mid: 'change-1', text: 'From changes' },
        },
      }],
    }],
  });
  assert.equal(result.changeEvents.length, 1);
  assert.equal(result.events.length, 1);
  assert.equal(result.events[0].message.text, 'From changes');
});

test('ignores generic webhook subscription test notifications', () => {
  const result = normalizeInstagramMessageEvents({
    object: 'instagram',
    entry: [{ changes: [{ field: 'messages', value: { status: 'subscribed' } }] }],
  });
  assert.equal(result.changeEvents.length, 0);
  assert.equal(result.events.length, 0);
});

test('accepts Razorpay QR-scoped payment data without undocumented qr_code_id', () => {
  const payment = {
    id: 'pay_test123',
    status: 'captured',
    currency: 'INR',
    amount: 120000,
  };
  assert.equal(isCapturedInrPayment(payment, 'pay_test123', 120000), true);
  assert.equal(isCapturedInrPayment({ ...payment, amount: 70000 }, 'pay_test123', 120000), false);
  assert.equal(isCapturedInrPayment({ ...payment, status: 'authorized' }, 'pay_test123', 120000), false);
  assert.equal(isCapturedInrPayment({ ...payment, currency: 'USD' }, 'pay_test123', 120000), false);
  assert.equal(isCapturedInrPayment(payment, 'pay_different', 120000), false);
});
