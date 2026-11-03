import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeCustomerMemory } from '../customer-memory-utils.js';

test('keeps concise non-sensitive preferences and removes sensitive facts', () => {
  const result = sanitizeCustomerMemory({
    preferred_language: ' Hindi ',
    preferred_plate_style: 'bold black letters',
    phone: '9876543210',
    customer_email: 'person@example.com',
    home_location: 'Pindra, Garhwa',
    favorite_color: '9876543210',
    preferred_time: 'Evening',
  }, 'Prefers short messages in Hindi.');
  assert.deepEqual(result, {
    facts: {
      preferred_language: 'Hindi',
      preferred_plate_style: 'bold black letters',
      preferred_time: 'Evening',
    },
    summary: 'Prefers short messages in Hindi.',
  });
});

test('removes sensitive content embedded in summaries', () => {
  assert.equal(
    sanitizeCustomerMemory({}, 'Customer phone number is 9876543210.').summary,
    ''
  );
  assert.equal(
    sanitizeCustomerMemory({}, 'Customer has a medical diagnosis.').summary,
    ''
  );
  assert.equal(
    sanitizeCustomerMemory({}, 'Customer belongs to a specific caste.').summary,
    ''
  );
});

test('limits fact count, key format, and value length', () => {
  const facts = {};
  for (let i = 0; i < 25; i++) facts['pref_' + i] = 'x'.repeat(20);
  facts['bad key'] = 'value';
  facts['too_long'] = 'x'.repeat(241);
  const result = sanitizeCustomerMemory(facts, '');
  assert.equal(Object.keys(result.facts).length, 20);
  assert.equal(result.facts['bad key'], undefined);
  assert.equal(result.facts.too_long, undefined);
  assert.equal(result.summary, '');
});
