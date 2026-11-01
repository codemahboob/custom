import vm from 'node:vm';
import DASHBOARD from '../dashboard-html.js';
const match = DASHBOARD.match(/<script>([\s\S]*?)<\/script>/i);
if (!match) throw new Error('Dashboard script tag not found');
new vm.Script(match[1], { filename: 'dashboard-inline.js' });
console.log('Dashboard inline JavaScript syntax OK');
