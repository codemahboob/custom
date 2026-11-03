// Minimal CustomPlate dashboard. Data is loaded from the existing authenticated API.
export default `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#F7F6F1">
<title>CustomPlate — Dashboard</title>
<style>
:root{color-scheme:light;--paper:#F7F6F1;--blue:#1936B8;--ink:#292D3A;--muted:#777A82;--rule:#85858A}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:var(--paper);color:var(--ink)}
body{font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
main{width:min(100%,760px);margin:0 auto;padding:30px 28px 42px}
header{display:flex;justify-content:space-between;align-items:center;margin-bottom:34px}
.brand{color:var(--blue);font-size:15px;font-weight:900;letter-spacing:-.5px}
.date-control select{appearance:none;-webkit-appearance:none;border:1.5px solid var(--rule);border-radius:0;background:transparent;color:var(--blue);font:800 11px/1 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.45px;padding:10px 30px 10px 11px;cursor:pointer;background-image:linear-gradient(45deg,transparent 50%,var(--blue) 50%),linear-gradient(135deg,var(--blue) 50%,transparent 50%);background-position:calc(100% - 13px) 13px,calc(100% - 9px) 13px;background-size:4px 4px,4px 4px;background-repeat:no-repeat}.date-control select:focus-visible{outline:2px solid var(--blue);outline-offset:3px}.date-control option{background:#F7F6F1;color:#292D3A}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.intro{display:grid;grid-template-columns:54px 1fr;gap:16px;align-items:start;margin-bottom:72px;color:var(--blue)}
.index{font-size:30px;line-height:1;font-weight:900;letter-spacing:-1.5px}
h1{font-size:clamp(34px,7vw,52px);line-height:.88;letter-spacing:-2.8px;font-weight:950;margin:0}
.metrics{display:flex;flex-direction:column}
.metric{padding:0 0 10px;margin:0 0 12px;border-bottom:1.5px solid var(--rule)}
.metric:last-child{margin-bottom:0}
.metric-label{display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:10px;line-height:1.2;font-weight:850;letter-spacing:.45px;color:var(--ink)}
.metric-value{font-size:clamp(54px,12vw,78px);line-height:1.04;letter-spacing:-4.5px;font-weight:950;text-align:center;color:var(--blue);font-variant-numeric:tabular-nums;margin-top:4px}
footer{border-top:1.5px solid var(--rule);margin-top:18px;padding-top:12px;display:flex;justify-content:space-between;font-size:9px;letter-spacing:1px;font-weight:800;color:var(--muted)}\n.connect{display:inline-block;margin-left:auto;margin-right:12px;padding:10px 11px;border:1.5px solid var(--blue);color:var(--blue);text-decoration:none;font:800 10px/1 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.35px}.connect:focus-visible{outline:2px solid var(--blue);outline-offset:3px}
.error{font-size:12px;color:#9b2929;margin-top:18px;min-height:18px}
@media(max-width:480px){main{padding:24px 20px 34px}header{margin-bottom:30px}.intro{grid-template-columns:42px 1fr;gap:12px;margin-bottom:58px}.index{font-size:26px}h1{font-size:clamp(31px,9vw,42px);letter-spacing:-2px}.metric-value{font-size:clamp(52px,15vw,68px);letter-spacing:-3.5px}.metric{margin-bottom:11px;padding-bottom:9px}}
</style>
</head>
<body>
<main>
<header>
  <div class="brand">CUSTOMPLATE®</div>\n  <a class="connect" href="/auth/instagram">CONNECT INSTAGRAM</a>
  <label class="date-control"><span class="sr-only">Date range</span><select id="date-range" aria-label="Select date range"><option value="today">Today</option><option value="week">This week</option><option value="month">This month</option><option value="lifetime" selected>Lifetime</option></select></label>
</header>
<section class="intro" aria-label="Dashboard heading">
  <div class="index">01</div>
  <h1>BUSINESS<br>OVERVIEW</h1>
</section>
<section class="metrics" aria-label="Business metrics" aria-live="polite">
  <div class="metric">
    <div class="metric-label"><span>01 — TOTAL REVENUE</span><span>INR</span></div>
    <div class="metric-value" id="revenue">₹—</div>
  </div>
  <div class="metric">
    <div class="metric-label"><span>02 — CONVERSATIONS</span><span>TOTAL</span></div>
    <div class="metric-value" id="conversations">—</div>
  </div>
  <div class="metric">
    <div class="metric-label"><span>03 — PAID ORDERS</span><span>TOTAL</span></div>
    <div class="metric-value" id="paid-orders">—</div>
  </div>
  <div class="metric">
    <div class="metric-label"><span>04 — PENDING PAYMENTS</span><span>TOTAL</span></div>
    <div class="metric-value" id="pending">—</div>
  </div>
</section>
<footer><span>CUSTOMPLATE</span><span id="updated">LOADING</span></footer>
<div class="error" id="error" role="status"></div>
</main>
<script>
let password=sessionStorage.getItem('pw')||'';
async function api(url){
  for(;;){
    if(!password){password=prompt('Dashboard password')||'';if(!password)throw new Error('Dashboard password is required.');}
    const auth=btoa(String.fromCharCode(...new TextEncoder().encode('admin:'+password)));
    const response=await fetch(url,{headers:{Authorization:'Basic '+auth}});
    if(response.status===401){password='';sessionStorage.removeItem('pw');continue;}
    if(!response.ok)throw new Error('Unable to load dashboard data ('+response.status+').');
    sessionStorage.setItem('pw',password);
    return response;
  }
}
const money=value=>'₹'+Number(value||0).toLocaleString('en-IN',{maximumFractionDigits:0});
function paidTimestamp(order){const value=Number(order.paid_at);return value<1e12?value*1000:value;}
function rangeStart(range){
  const date=new Date();date.setHours(0,0,0,0);
  if(range==='today')return date.getTime();
  if(range==='week'){const day=(date.getDay()+6)%7;date.setDate(date.getDate()-day);return date.getTime();}
  if(range==='month'){date.setDate(1);return date.getTime();}
  return 0;
}
async function refresh(){
  try{
    const response=await api('/api/data');
    const data=await response.json();
    const orders=Array.isArray(data.orders)?data.orders:[];
    const conversations=Array.isArray(data.convos)?data.convos:[];
    const range=document.getElementById('date-range').value;
    const start=rangeStart(range),now=Date.now();
    const inRange=timestamp=>{const value=Number(timestamp||0);const time=value<1e12?value*1000:value;return time>=start&&time<=now;};
    const paid=orders.filter(order=>order.paid_at&&inRange(order.paid_at));
    const scopedConversations=conversations.filter(conversation=>conversation.updated_at&&inRange(conversation.updated_at));
    const revenue=paid.reduce((sum,order)=>sum+Number(order.amount||0),0);
    const pending=scopedConversations.filter(conversation=>conversation.status==='awaiting_payment').length;
    document.getElementById('revenue').textContent=money(revenue);
    document.getElementById('conversations').textContent=scopedConversations.length.toLocaleString('en-IN');
    document.getElementById('paid-orders').textContent=paid.length.toLocaleString('en-IN');
    document.getElementById('pending').textContent=pending.toLocaleString('en-IN');
    document.getElementById('updated').textContent='UPDATED '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    document.getElementById('error').textContent='';
  }catch(error){
    document.getElementById('error').textContent=error.message;
    document.getElementById('updated').textContent='DATA UNAVAILABLE';
  }
}
document.getElementById('date-range').addEventListener('change',refresh);
refresh();
setInterval(refresh,15000);
</script>
</body>
</html>
`;