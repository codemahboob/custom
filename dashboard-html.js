// Dashboard page, served by server.js at /. Plain HTML inside a template literal.
export default `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#111315">
<title>Custom Plate — Command Center</title>
<style>
:root{color-scheme:dark;--bg:#111315;--panel:#1b1e20;--panel2:#202427;--tx:#f5f5f2;--mut:#92999d;--line:#303538;--red:#ef514b;--green:#55c98a;--amber:#f0b45b;--blue:#79b8f2}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--tx);font:14px/1.5 Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)}
main{max-width:1120px;margin:0 auto;padding:24px 20px 40px}
header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:28px}
.brand{display:flex;align-items:center;gap:12px}.mark{width:38px;height:38px;border-radius:11px;background:var(--red);display:grid;place-items:center;font-weight:900;font-size:21px;color:white}.brand-name{font-size:18px;font-weight:800;letter-spacing:-.7px}.eyebrow{font-size:10px;letter-spacing:1.5px;color:var(--mut);font-weight:700}
.live{display:inline-flex;align-items:center;gap:7px;border:1px solid #28523e;background:#16271f;color:var(--green);padding:6px 10px;border-radius:99px;font-size:11px;font-weight:700}.dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 9px #55c98a}
.section-head{display:flex;align-items:center;justify-content:space-between;margin:0 0 13px}.section-head h2{font-size:15px;margin:0;font-weight:700;letter-spacing:-.2px}.mut,small{color:var(--mut)}
.stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:14px}
.stat{background:var(--panel);border:1px solid var(--line);border-radius:15px;padding:17px 18px;min-width:0}.stat-top{display:flex;justify-content:space-between;align-items:center;color:var(--mut);font-size:12px}.stat-icon{width:30px;height:30px;display:grid;place-items:center;border-radius:9px;background:#292d30;color:var(--red);font-size:15px}.stat strong{display:block;font-size:30px;line-height:1.15;letter-spacing:-1.3px;margin:12px 0 2px}.stat small{font-size:11px}
.hero{background:linear-gradient(130deg,#202426,#191c1e);border:1px solid #34393c;border-radius:18px;padding:22px 23px;margin-bottom:27px;position:relative;overflow:hidden}.hero:after{content:"";position:absolute;width:210px;height:210px;border-radius:50%;right:-95px;top:-125px;border:1px solid #393d40;box-shadow:0 0 0 22px #ffffff03,0 0 0 48px #ffffff02}.hero-label{font-size:11px;color:#aeb4b7;letter-spacing:1px;font-weight:700}.revenue{font-size:clamp(34px,7vw,48px);font-weight:800;letter-spacing:-2px;margin:8px 0 1px}.hero-foot{display:flex;align-items:center;gap:8px;color:var(--mut);font-size:12px}.positive{color:var(--green);font-weight:700}
.toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}button{font:inherit;cursor:pointer}.tab{border:1px solid var(--line);background:var(--panel);color:#b8bec1;border-radius:9px;padding:8px 13px;font-size:12px}.tab.active{background:var(--red);border-color:var(--red);color:white}
.content-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.85fr);gap:14px;align-items:start}.panel{background:var(--panel);border:1px solid var(--line);border-radius:15px;padding:16px;min-width:0}.panel h3{font-size:14px;margin:0;font-weight:700}.panel-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}.list{display:flex;flex-direction:column;gap:0}.item{padding:13px 0;border-top:1px solid var(--line);cursor:pointer}.item:first-child{border-top:0;padding-top:0}.item:last-child{padding-bottom:0}.row{display:flex;justify-content:space-between;gap:12px;align-items:center}.name{font-weight:650;overflow-wrap:anywhere}.sub{font-size:11px;color:var(--mut);margin-top:3px}.status{font-size:10px;font-weight:700;padding:4px 8px;border-radius:99px;white-space:nowrap;background:#292e31;color:#aeb5b8}.status.paid{background:#173024;color:var(--green)}.status.awaiting_payment{background:#34291b;color:var(--amber)}.status.chatting{background:#222c36;color:var(--blue)}
#chat{margin-top:14px}#chat[hidden]{display:none!important}#log{max-height:330px;overflow:auto;display:flex;flex-direction:column;gap:7px;margin-top:13px}.bubble{max-width:86%;padding:9px 12px;border-radius:13px;white-space:pre-wrap;word-break:break-word;font-size:12px}.bubble.user{background:#29343c;align-self:flex-start}.bubble.assistant{background:#302b2a;align-self:flex-end}.act{border:1px solid var(--line);background:#252a2d;color:var(--tx);border-radius:8px;padding:6px 10px;font-size:11px}.memory{font-size:12px;color:#c5cbce;background:#202528;border-radius:10px;padding:12px;margin-top:12px}.memory p{margin:5px 0}.empty{color:var(--mut);font-size:12px;padding:14px 0}.sales-list{display:flex;flex-direction:column;gap:10px}.sale{display:flex;justify-content:space-between;gap:10px;font-size:12px}.sale b{font-weight:650}.sale small{display:block;font-size:10px}
[hidden]{display:none!important}:focus-visible{outline:2px solid var(--red);outline-offset:3px}
@media(max-width:680px){main{padding:17px 13px 30px}header{margin-bottom:22px}.stats{gap:7px}.stat{padding:12px 10px;border-radius:12px}.stat strong{font-size:25px}.stat-top{font-size:10px}.stat-icon{width:25px;height:25px}.stat small{font-size:10px}.hero{padding:19px;margin-bottom:22px}.content-grid{grid-template-columns:1fr}.panel{padding:14px}}
</style>
</head>
<body>
<main>
<header>
  <div class="brand"><div class="mark">C</div><div><div class="brand-name">customplate</div><div class="eyebrow">COMMAND CENTER</div></div></div>
  <div class="live"><span class="dot"></span> LIVE</div>
</header>
<div class="section-head"><h2>Overview</h2><span class="mut" id="updated">Updating…</span></div>
<section class="stats" aria-label="Conversation overview">
  <div class="stat"><div class="stat-top"><span>Conversations</span><span class="stat-icon">◎</span></div><strong id="all-count">—</strong><small>All customer chats</small></div>
  <div class="stat"><div class="stat-top"><span>Confirmed</span><span class="stat-icon" style="color:var(--green)">✓</span></div><strong id="paid-count">—</strong><small>Payment verified</small></div>
  <div class="stat"><div class="stat-top"><span>About to confirm</span><span class="stat-icon" style="color:var(--amber)">↗</span></div><strong id="hot-count">—</strong><small>Awaiting payment</small></div>
</section>
<section class="hero">
  <div class="hero-label">TOTAL SALES · TODAY</div>
  <div class="revenue" id="revenue">₹—</div>
  <div class="hero-foot"><span class="positive">●</span><span id="sales-count">0 paid orders</span><span>·</span><span>Verified via Razorpay</span></div>
</section>
<div class="content-grid">
  <section class="panel">
    <div class="panel-head"><h3>Conversations</h3><span class="mut" id="chat-total">—</span></div>
    <div class="toolbar">
      <button class="tab active" data-filter="all">All</button><button class="tab" data-filter="paid">Confirmed</button><button class="tab" data-filter="awaiting_payment">Pending</button><button class="tab" data-filter="chatting">New</button>
    </div>
    <div class="list" id="convos"><div class="empty">Loading conversations…</div></div>
    <div id="chat" class="panel" hidden>
      <div class="panel-head"><div><h3 id="who">Customer</h3><small id="chat-status"></small></div><div><button class="act" id="pause"></button> <button class="act" id="close">Close</button></div></div>
      <div class="memory" id="memory"></div><div id="log"></div>
    </div>
  </section>
  <section class="panel">
    <div class="panel-head"><h3>Recent sales</h3><span class="mut">Paid orders</span></div>
    <div class="sales-list" id="orders"><div class="empty">Loading orders…</div></div>
  </section>
</div>
</main>
<script>
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STATUS={chatting:'New conversation',awaiting_payment:'Awaiting payment',paid:'Confirmed'};
let data={orders:[],convos:[]},openId=null,filter='all',pw=sessionStorage.getItem('pw');
async function api(url,opts={}){
  for(;;){
    if(!pw){pw=prompt('Dashboard password');if(!pw)throw new Error('Password required. Reload to try again.');}
    const auth=btoa(String.fromCharCode(...new TextEncoder().encode('admin:'+pw)));
    const r=await fetch(url,{...opts,headers:{Authorization:'Basic '+auth}});
    if(r.status!==401){sessionStorage.setItem('pw',pw);return r;}
    pw=null;sessionStorage.removeItem('pw');
  }
}
const money=n=>'₹'+Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:0});
function render(){
 const orders=data.orders||[],convos=data.convos||[];
 const today=new Date();today.setHours(0,0,0,0);
 const todays=orders.filter(o=>Number(o.paid_at)>=today.getTime());
 const total=todays.reduce((s,o)=>s+Number(o.amount||0),0);
 $('#all-count').textContent=convos.length;
 $('#paid-count').textContent=convos.filter(c=>c.status==='paid').length;
 $('#hot-count').textContent=convos.filter(c=>c.status==='awaiting_payment').length;
 $('#revenue').textContent=money(total);
 $('#sales-count').textContent=todays.length+' paid '+(todays.length===1?'order':'orders');
 $('#chat-total').textContent=convos.length+' total';
 $('#updated').textContent='Updated '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
 const visible=convos.filter(c=>filter==='all'||c.status===filter);
 $('#convos').innerHTML=visible.map(c=>{
  let x={};try{x=JSON.parse(c.order_json||'{}')}catch{}
  return '<div class="item" data-id="'+esc(c.ig_id)+'"><div class="row"><span class="name">@'+esc(c.username||c.ig_id)+'</span><span class="status '+esc(c.status)+'">'+esc(STATUS[c.status]||c.status)+(c.paused?' · paused':'')+'</span></div><div class="sub">'+esc([x.vehicle,x.plate_text].filter(Boolean).join(' · ')||'Details not added yet')+'</div><div class="sub">'+esc(c.memory_summary||'')+'</div></div>';
 }).join('')||'<div class="empty">No conversations in this view.</div>';
 $('#orders').innerHTML=orders.slice(0,8).map(o=>{
  let x={};try{x=JSON.parse(o.order_json||'{}')}catch{}
  return '<div class="sale"><div><b>'+esc(x.plate_text||'Custom plate')+'</b><small>@'+esc(o.username||o.ig_id)+' · '+new Date(Number(o.paid_at)).toLocaleString([], {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})+'</small></div><b>'+money(o.amount)+'</b></div>';
 }).join('')||'<div class="empty">No paid orders yet.</div>';
 if(openId)showChat(openId,false);
}
async function load(){const r=await api('/api/data');if(!r.ok)throw new Error('Unable to load dashboard data.');data=await r.json();render();}
async function showChat(id,scroll=true){
 openId=id;const c=data.convos.find(x=>x.ig_id===id);
 const [mr,cr]=await Promise.all([api('/api/msgs/'+encodeURIComponent(id)),api('/api/customer/'+encodeURIComponent(id))]);
 if(!mr.ok||!cr.ok)throw new Error('Unable to load customer history.');
 const msgs=await mr.json(),customer=await cr.json();
 $('#chat').hidden=false;$('#who').textContent='@'+(c?.username||id);$('#chat-status').textContent=STATUS[c?.status]||'';
 $('#pause').textContent=c?.paused?'Resume bot':'Pause bot';
 const facts=Object.entries(customer.profile||{}).map(([k,v])=>'<p><small>'+esc(k.replaceAll('_',' '))+':</small> '+esc(v)+'</p>').join('');
 const past=(customer.orders||[]).map(o=>{let x={};try{x=JSON.parse(o.order_json)}catch{}return '<p>'+esc(x.plate_text||'Order')+' · '+money(o.amount)+' · '+new Date(Number(o.paid_at)).toLocaleDateString()+'</p>';}).join('');
 $('#memory').innerHTML='<b>Customer history</b><p>'+esc(customer.summary||'No saved summary yet.')+'</p>'+facts+(past?'<hr>'+past:'');
 $('#log').innerHTML=msgs.map(m=>'<div class="bubble '+esc(m.role)+'">'+esc(m.text)+'</div>').join('');
 if(scroll)$('#log').scrollTop=$('#log').scrollHeight;
}
$('#convos').onclick=e=>{const el=e.target.closest('[data-id]');if(el)showChat(el.dataset.id).catch(err=>alert(err.message));};
$('#close').onclick=()=>{openId=null;$('#chat').hidden=true;};
$('#pause').onclick=async()=>{const r=await api('/api/pause/'+encodeURIComponent(openId),{method:'POST'});if(r.ok)await load();};
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));render();});
load().catch(e=>{$('#convos').innerHTML='<div class="empty">'+esc(e.message)+'</div>';});
setInterval(()=>{if(pw)load().catch(()=>{});},10000);
</script>
</body>
</html>
`;