// Dashboard page, served by server.js at /. Plain HTML inside a template literal.
export default `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Plate orders</title>
<style>
:root{--bg:#eef1f4;--card:#fff;--tx:#14202b;--mut:#5d6b78;--ln:#d8dee4;--ac:#0b5cad;--ok:#13795b;--warn:#a85d00;--me:#dbeafe;--bot:#f1f3f5}
@media(prefers-color-scheme:dark){:root{--bg:#0e141a;--card:#16202a;--tx:#e8eef4;--mut:#93a1ae;--ln:#26333f;--ac:#6ab0ff;--ok:#4fd1a5;--warn:#f0b35a;--me:#1d3a5c;--bot:#202c37}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--tx);font:15px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)}
main{max-width:720px;margin:0 auto;padding:16px}
h1{font-size:20px;margin:4px 0 14px}
#stats{display:flex;gap:10px;margin-bottom:14px}
#stats div{flex:1;background:var(--card);border:1px solid var(--ln);border-radius:10px;padding:10px 12px}
#stats b{display:block;font-size:22px}
#stats span,.mut,small{color:var(--mut);font-size:13px}
nav{display:flex;gap:8px;margin-bottom:12px}
nav button,.act{font:inherit;border:1px solid var(--ln);background:var(--card);color:var(--tx);border-radius:8px;padding:7px 14px;cursor:pointer}
nav button.on{background:var(--ac);border-color:var(--ac);color:#fff}
:focus-visible{outline:2px solid var(--ac);outline-offset:2px}
.card{background:var(--card);border:1px solid var(--ln);border-radius:10px;padding:12px 14px;margin-bottom:10px}
.card p{margin:4px 0}
.row{display:flex;justify-content:space-between;gap:10px;align-items:baseline}
.ok{color:var(--ok);font-weight:600}.warn{color:var(--warn);font-weight:600}
[data-id]{cursor:pointer}
#chat{background:var(--card);border:1px solid var(--ln);border-radius:10px;padding:12px;margin-bottom:12px}
#log{max-height:55vh;overflow:auto;display:flex;flex-direction:column;gap:6px;margin-top:10px}
.b{max-width:85%;padding:7px 11px;border-radius:12px;white-space:pre-wrap;word-break:break-word}
.b.user{background:var(--me);align-self:flex-start}.b.assistant{background:var(--bot);align-self:flex-end}
[hidden]{display:none!important}
</style>
</head>
<body>
<main>
  <h1>Plate orders</h1>
  <div id="stats"></div>
  <nav><button id="t-orders" class="on">Paid orders</button><button id="t-chats">Chats</button></nav>
  <section id="orders"></section>
  <section id="chats" hidden>
    <div id="chat" hidden>
      <div class="row"><b id="who"></b><span><button class="act" id="pause"></button> <button class="act" id="close">Close</button></span></div>
      <div id="log"></div>
    </div>
    <div id="convos"></div>
  </section>
</main>
<script>
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const STATUS = { chatting: 'Chatting', awaiting_payment: 'Awaiting payment', paid: 'Paid' };
let data = { orders: [], convos: [] }, openId = null;

let pw = sessionStorage.getItem('pw');
async function api(url, opts = {}) {
  for (;;) {
    if (!pw) { pw = prompt('Dashboard password'); if (!pw) throw new Error('Password needed. Reload the page to try again.'); }
    const auth = btoa(String.fromCharCode(...new TextEncoder().encode('admin:' + pw)));
    const r = await fetch(url, { ...opts, headers: { Authorization: 'Basic ' + auth } });
    if (r.status !== 401) { sessionStorage.setItem('pw', pw); return r; }
    pw = null; sessionStorage.removeItem('pw');
  }
}

async function load() {
  const r = await api('/api/data');
  if (!r.ok) throw new Error('Server error. Open /health on this site to see what is wrong.');
  data = await r.json();
  const o = data.orders;
  $('#stats').innerHTML =
    \`<div><b>\${o.length}</b><span>Paid orders</span></div>\` +
    \`<div><b>₹\${o.reduce((a, x) => a + x.amount, 0)}</b><span>Collected</span></div>\` +
    \`<div><b>\${data.convos.filter((c) => c.status === 'awaiting_payment').length}</b><span>Awaiting payment</span></div>\`;
  $('#orders').innerHTML = o.map((r) => {
    const x = JSON.parse(r.order_json);
    return \`<div class="card"><div class="row"><b>\${esc(x.plate_text)}</b><span class="ok">₹\${r.amount} paid</span></div>
      <p>\${esc(x.vehicle)}: \${esc(x.name)}, \${esc(x.phone)}</p><p>\${esc(x.address)}</p>
      <small>@\${esc(r.username)} on \${new Date(r.paid_at).toLocaleString()} (\${esc(r.payment_id)})</small></div>\`;
  }).join('') || '<p class="mut">No paid orders yet.</p>';
  $('#convos').innerHTML = data.convos.map((c) => {
    const x = JSON.parse(c.order_json);
    return \`<div class="card" data-id="\${esc(c.ig_id)}"><div class="row"><b>@\${esc(c.username || c.ig_id)}</b>
      <span class="\${c.status === 'paid' ? 'ok' : c.status === 'awaiting_payment' ? 'warn' : 'mut'}">\${STATUS[c.status]}\${c.paused ? ' (bot paused)' : ''}</span></div>
      <small>\${esc(x.vehicle || 'vehicle not set')}\${x.plate_text ? ': ' + esc(x.plate_text) : ''}</small></div>\`;
  }).join('') || '<p class="mut">No chats yet.</p>';
  if (openId) showChat(openId, false);
}

async function showChat(id, scroll = true) {
  openId = id;
  const c = data.convos.find((x) => x.ig_id === id);
  const msgs = await (await api('/api/msgs/' + encodeURIComponent(id))).json();
  $('#chat').hidden = false;
  $('#who').textContent = '@' + (c?.username || id);
  $('#pause').textContent = c?.paused ? 'Resume bot' : 'Pause bot';
  $('#log').innerHTML = msgs.map((m) => \`<div class="b \${m.role}">\${esc(m.text)}</div>\`).join('');
  if (scroll) $('#log').scrollTop = $('#log').scrollHeight;
}

$('#convos').onclick = (e) => { const el = e.target.closest('[data-id]'); if (el) showChat(el.dataset.id); };
$('#close').onclick = () => { openId = null; $('#chat').hidden = true; };
$('#pause').onclick = async () => { await api('/api/pause/' + encodeURIComponent(openId), { method: 'POST' }); await load(); };
const tab = (on) => { $('#orders').hidden = on !== 'orders'; $('#chats').hidden = on !== 'chats'; $('#t-orders').classList.toggle('on', on === 'orders'); $('#t-chats').classList.toggle('on', on === 'chats'); };
$('#t-orders').onclick = () => tab('orders');
$('#t-chats').onclick = () => tab('chats');
load().catch((e) => { $('#orders').innerHTML = '<p class="mut">' + esc(e.message) + '</p>'; });
setInterval(() => { if (pw) load().catch(() => {}); }, 10000);
</script>
</body>
</html>
`;
