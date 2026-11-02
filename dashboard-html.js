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

/* Refined command-center dashboard */
main{max-width:1180px;padding:24px 20px 48px}
header{padding-bottom:22px;border-bottom:1px solid var(--line);margin-bottom:28px}
.mark{width:46px;height:46px;border-radius:12px}
.brand-name{font-size:21px}
.eyebrow{font-size:11px}
.section-head{margin-bottom:16px}
.section-head h2{font-size:21px;letter-spacing:-.6px}
.periods{display:flex;gap:10px;margin:0 0 18px}
.period{border:0;background:transparent;color:var(--mut);padding:10px 18px;border-radius:99px;font-weight:650;font-size:14px}
.period.active{background:#292d30;color:#fff}
.hero{padding:24px 22px 19px;margin-bottom:16px;border:0;background:#1b1e20;border-radius:22px}
.hero:after{display:none}
.hero-label{font-size:13px;letter-spacing:.2px}
.revenue{font-size:clamp(38px,8vw,52px);margin:12px 0 10px}
.hero-foot{font-size:13px}
.progress{height:7px;border-radius:99px;background:#383d40;margin-top:16px;overflow:hidden}
.progress span{display:block;height:100%;width:0;background:var(--red);border-radius:99px;transition:width .25s}
.stats{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:24px}
.stat{border:0;border-radius:18px;padding:18px;background:#1b1e20;min-height:132px}
.stat-top{font-size:12px}
.stat-icon{background:transparent;width:26px;height:26px;font-size:19px}
.stat strong{font-size:36px;margin:8px 0 5px}
.stat small{font-size:13px}
.content-grid{grid-template-columns:minmax(0,1fr);gap:18px}
.panel{border:0;border-radius:18px;padding:18px;background:#1b1e20}
.panel h3{font-size:20px;letter-spacing:-.5px}
.panel-head{margin-bottom:16px}
.sales-panel{margin-bottom:18px}
.chart-wrap{background:#202427;border-radius:16px;padding:16px 14px 12px}
.chart-title{display:flex;justify-content:space-between;color:var(--mut);font-size:13px;margin-bottom:14px}
.chart{height:128px;display:flex;align-items:flex-end;gap:clamp(5px,1.8vw,14px)}
.bar{flex:1;min-width:0;border-radius:6px 6px 3px 3px;background:#555b5e;position:relative}
.bar:last-child{background:var(--red)}
.chart-labels{display:flex;justify-content:space-between;color:var(--mut);font-size:11px;margin-top:12px}
.report-link{color:var(--red);font-size:13px;font-weight:700;text-decoration:none}
.toolbar{gap:8px}
.tab{border-radius:99px;padding:8px 12px}
.tab.active{background:#303438;border-color:#303438;color:#fff}
.item{padding:14px 0}
.sale{font-size:13px;padding:8px 0;border-bottom:1px solid var(--line)}
.sale:last-child{border-bottom:0}
.sale small{font-size:11px}
@media(min-width:760px){.stats{grid-template-columns:repeat(4,minmax(0,1fr))}.content-grid{grid-template-columns:minmax(0,1.2fr) minmax(320px,.8fr)}.hero{margin-bottom:18px}.sales-panel{grid-column:1/-1}}
@media(max-width:680px){main{padding:17px 13px 30px}.stats{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.stat{padding:16px;min-height:126px}.stat strong{font-size:34px}.stat-top{font-size:11px}.stat small{font-size:12px}.hero{padding:20px 18px}.section-head h2{font-size:19px}.panel{padding:16px}.panel h3{font-size:19px}.chart{height:112px}}

</style>
</head>
<body>
<main>
<header>
  <div class="brand"><div class="mark">C</div><div><div class="brand-name">customplate</div><div class="eyebrow">COMMAND CENTER</div></div></div>
  <div class="live"><span class="dot"></span> LIVE</div>
</header>

<div class="section-head"><h2>Overview</h2><span class="mut" id="updated">Updating…</span></div>
<div class="periods" role="group" aria-label="Revenue period">
  <button class="period active" data-period="today">Today</button>
  <button class="period" data-period="7">7 days</button>
  <button class="period" data-period="30">30 days</button>
</div>
<section class="hero">
  <div class="hero-label">TOTAL REVENUE</div>
  <div class="revenue" id="revenue">₹—</div>
  <div class="hero-foot"><span class="positive" id="growth">●</span><span id="period-caption">Verified payments in selected period</span></div>
  <div class="progress"><span id="revenue-progress"></span></div>
</section>
<section class="stats" aria-label="Business overview">
  <div class="stat"><div class="stat-top"><span>Conversations</span><span class="stat-icon">▢</span></div><strong id="all-count">—</strong><small>All customer chats</small></div>
  <div class="stat"><div class="stat-top"><span>Confirmed orders</span><span class="stat-icon" style="color:var(--green)">▣</span></div><strong id="paid-count">—</strong><small>Payment verified</small></div>
  <div class="stat"><div class="stat-top"><span>Hot leads</span><span class="stat-icon" style="color:var(--amber)">♨</span></div><strong id="hot-count">—</strong><small>Awaiting payment</small></div>
  <div class="stat"><div class="stat-top"><span>Average order</span><span class="stat-icon" style="color:var(--blue)">▤</span></div><strong id="average-order">₹0</strong><small>Per paid order</small></div>
</section>
<section class="sales-panel">
  <div class="panel-head"><h3>Sales activity</h3><span class="mut" id="chart-total">—</span></div>
  <div class="chart-wrap">
    <div class="chart-title"><span>Revenue overview</span><span id="chart-period">Today</span></div>
    <div class="chart" id="chart" aria-label="Revenue bar chart"></div>
    <div class="chart-labels" id="chart-labels"><span>Start</span><span>Middle</span><span>Now</span></div>
  </div>
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
    <div class="panel-head"><h3>Recent orders</h3><span class="mut" id="orders-count">Paid orders</span></div>
    <div class="sales-list" id="orders"><div class="empty">Loading orders…</div></div>
  </section>
</div>
</main>
<script>
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STATUS={chatting:'New conversation',awaiting_payment:'Awaiting payment',paid:'Confirmed'};
let data={orders:[],convos:[]},openId=null,filter='all',period='today',pw=sessionStorage.getItem('pw');
async function api(url,opts={}){
 for(;;){if(!pw){pw=prompt('Dashboard password');if(!pw)throw new Error('Password required. Reload to try again.');}
 const auth=btoa(String.fromCharCode(...new TextEncoder().encode('admin:'+pw)));
 const r=await fetch(url,{...opts,headers:{Authorization:'Basic '+auth}});
 if(r.status!==401){sessionStorage.setItem('pw',pw);return r;}pw=null;sessionStorage.removeItem('pw');}
}
const money=n=>'₹'+Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:0});
const paidTime=o=>{let n=Number(o.paid_at);return n<1e12?n*1000:n;};
function periodStart(){const d=new Date();d.setHours(0,0,0,0);if(period==='7')d.setDate(d.getDate()-6);if(period==='30')d.setDate(d.getDate()-29);return d.getTime();}
function renderChart(orders){
 const now=Date.now(),start=periodStart(),bins=period==='today'?12:period==='7'?7:10,step=(now-start)/bins;
 const vals=Array(bins).fill(0);
 orders.forEach(o=>{const t=paidTime(o);if(t>=start&&t<=now){const i=Math.min(bins-1,Math.max(0,Math.floor((t-start)/step)));vals[i]+=Number(o.amount||0);}});
 const max=Math.max(1,...vals);
 $('#chart').innerHTML=vals.map(v=>'<div class="bar" style="height:'+Math.max(8,Math.round(v/max*100))+'%" title="'+esc(money(v))+'"></div>').join('');
 const labels=period==='today'?['12 AM','12 PM','Now']:period==='7'?['7 days ago','3 days ago','Today']:['30 days ago','15 days ago','Today'];
 $('#chart-labels').innerHTML=labels.map(x=>'<span>'+x+'</span>').join('');
 $('#chart-period').textContent=period==='today'?'Today':period+' days';
 $('#chart-total').textContent=money(vals.reduce((a,b)=>a+b,0));
}
function render(){
 const orders=data.orders||[],convos=data.convos||[],start=periodStart(),now=Date.now();
 const selected=orders.filter(o=>paidTime(o)>=start&&paidTime(o)<=now);
 const total=selected.reduce((s,o)=>s+Number(o.amount||0),0);
 $('#all-count').textContent=convos.length;$('#paid-count').textContent=convos.filter(c=>c.status==='paid').length;
 $('#hot-count').textContent=convos.filter(c=>c.status==='awaiting_payment').length;
 $('#average-order').textContent=money(selected.length?total/selected.length:0);
 $('#revenue').textContent=money(total);$('#period-caption').textContent=selected.length+' verified '+(selected.length===1?'payment':'payments')+' in selected period';
 $('#growth').textContent='●';$('#revenue-progress').style.width=(total?Math.max(8,Math.min(100,total/(Math.max(total,Number(data.previous_total||0),1))*100)):0)+'%';
 $('#chat-total').textContent=convos.length+' total';$('#orders-count').textContent=orders.length+' paid';
 $('#updated').textContent='Updated '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
 renderChart(orders);
 const visible=convos.filter(c=>filter==='all'||c.status===filter);
 $('#convos').innerHTML=visible.map(c=>{let x={};try{x=JSON.parse(c.order_json||'{}')}catch{}
 return '<div class="item" data-id="'+esc(c.ig_id)+'"><div class="row"><span class="name">@'+esc(c.username||c.ig_id)+'</span><span class="status '+esc(c.status)+'">'+esc(STATUS[c.status]||c.status)+(c.paused?' · paused':'')+'</span></div><div class="sub">'+esc([x.vehicle,x.plate_text].filter(Boolean).join(' · ')||'Details not added yet')+'</div><div class="sub">'+esc(c.memory_summary||'')+'</div></div>';}).join('')||'<div class="empty">No conversations in this view.</div>';
 $('#orders').innerHTML=orders.slice(0,10).map(o=>{let x={};try{x=JSON.parse(o.order_json||'{}')}catch{}
 return '<div class="sale"><div><b>'+esc(x.plate_text||'Custom plate')+'</b><small>@'+esc(o.username||o.ig_id)+' · '+new Date(paidTime(o)).toLocaleString([],{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})+'</small></div><b>'+money(o.amount)+'</b></div>';}).join('')||'<div class="empty">No paid orders yet.</div>';
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
 const past=(customer.orders||[]).map(o=>{let x={};try{x=JSON.parse(o.order_json)}catch{}return '<p>'+esc(x.plate_text||'Order')+' · '+money(o.amount)+' · '+new Date(paidTime(o)).toLocaleDateString()+'</p>';}).join('');
 $('#memory').innerHTML='<b>Customer history</b><p>'+esc(customer.summary||'No saved summary yet.')+'</p>'+facts+(past?'<hr>'+past:'');
 $('#log').innerHTML=msgs.map(m=>'<div class="bubble '+esc(m.role)+'">'+esc(m.text)+'</div>').join('');if(scroll)$('#log').scrollTop=$('#log').scrollHeight;
}
$('#convos').onclick=e=>{const el=e.target.closest('[data-id]');if(el)showChat(el.dataset.id).catch(err=>alert(err.message));};
$('#close').onclick=()=>{openId=null;$('#chat').hidden=true;};
$('#pause').onclick=async()=>{const r=await api('/api/pause/'+encodeURIComponent(openId),{method:'POST'});if(r.ok)await load();};
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));render();});
document.querySelectorAll('[data-period]').forEach(b=>b.onclick=()=>{period=b.dataset.period;document.querySelectorAll('[data-period]').forEach(x=>x.classList.toggle('active',x===b));render();});
load().catch(e=>{$('#convos').innerHTML='<div class="empty">'+esc(e.message)+'</div>';});
setInterval(()=>{if(pw)load().catch(()=>{});},10000);
</script>
</body>
</html>
`;