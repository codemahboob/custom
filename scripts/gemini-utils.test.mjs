import test from 'node:test';
import assert from 'node:assert/strict';
import { toGeminiContents, fromGeminiParts } from '../gemini-utils.js';

test('preserves Gemini 3 function-call IDs and thought signatures in history', () => {
  const messages = [
    { role: 'user', content: 'Place an order for a car plate.' },
    {
      role: 'assistant',
      content: [{
        type: 'tool_use',
        id: 'call-123',
        name: 'update_order',
        input: { vehicle: 'car' },
        thoughtSignature: 'signature-A',
      }],
    },
    {
      role: 'user',
      content: [{
        type: 'tool_result',
        tool_use_id: 'call-123',
        name: 'update_order',
        content: 'Order updated.',
      }],
    },
  ];
  assert.deepEqual(toGeminiContents(messages), [
    { role: 'user', parts: [{ text: 'Place an order for a car plate.' }] },
    {
      role: 'model',
      parts: [{
        functionCall: { name: 'update_order', args: { vehicle: 'car' }, id: 'call-123' },
        thoughtSignature: 'signature-A',
      }],
    },
    {
      role: 'user',
      parts: [{
        functionResponse: {
          name: 'update_order',
          response: { output: 'Order updated.' },
          id: 'call-123',
        },
      }],
    },
  ]);
});

test('retains the thought signature returned with Gemini function calls', () => {
  const content = fromGeminiParts([{
    functionCall: { name: 'send_payment_qr', id: 'call-456', args: { amount: 1200 } },
    thoughtSignature: 'signature-B',
  }]);
  assert.deepEqual(content, [{
    type: 'tool_use',
    id: 'call-456',
    name: 'send_payment_qr',
    input: { amount: 1200 },
    thoughtSignature: 'signature-B',
  }]);
});

test('does not invent an ID when Gemini did not return one', () => {
  const content = fromGeminiParts([{
    functionCall: { name: 'call_owner', args: { reason: 'Need help' } },
  }]);
  assert.equal(content[0].id, null);
  const request = toGeminiContents([{ role: 'assistant', content }]);
  assert.deepEqual(request[0].parts[0].functionCall, {
    name: 'call_owner',
    args: { reason: 'Need help' },
  });
});

test('preserves thought signatures on text parts without changing the text', () => {
  const signature = 'signature-C';
  const content = fromGeminiParts([{ text: 'Done.', thoughtSignature: signature }]);
  assert.deepEqual(content, [{ type: 'text', text: 'Done.', thoughtSignature: signature }]);
  assert.deepEqual(toGeminiContents([{ role: 'assistant', content }])[0].parts[0], {
    text: 'Done.',
    thoughtSignature: signature,
  });
});
