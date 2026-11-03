import assert from 'node:assert/strict';
import vm from 'node:vm';
import DASHBOARD from '../dashboard-html.js';
import PRIVACY_POLICY from '../privacy-policy.js';

const match = DASHBOARD.match(/<script>([\\s\\S]*?)<\\/script>/i);
assert.ok(match, 'Dashboard script tag must exist');
new vm.Script(match[1], { filename: 'dashboard-inline.js' });

for (const id of [
  'date-range', 'revenue', 'conversations', 'paid-orders', 'pending',
  'thread-list', 'chat-messages', 'customer-summary', 'customer-facts',
  'customer-orders', 'reply-form', 'pause-chat',
]) {
  assert.match(DASHBOARD, new RegExp('id="' + id + '"'), `Dashboard element #${id} must exist`);
}
assert.match(DASHBOARD, /\\/api\\/metrics\\?start=/, 'Dashboard must use server-side aggregate metrics');
assert.match(DASHBOARD, /TextEncoder\\(\\)\\.encode\\(text\\)\\.length/, 'Manual replies must enforce Instagram UTF-8 byte limit');
assert.doesNotMatch(DASHBOARD, /\\.innerHTML\\s*=/, 'Dashboard must not inject untrusted content with innerHTML');
assert.match(PRIVACY_POLICY, /Google.*Gemini|Gemini.*Google/i, 'Privacy policy must identify the actual Gemini provider');
assert.doesNotMatch(PRIVACY_POLICY, /Anthropic/i, 'Privacy policy must not name an unused AI provider');
console.log('Dashboard JavaScript and project consistency checks OK');
