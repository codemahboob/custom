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
footer{border-top:1.5px solid var(--rule);margin-top:18px;padding-top:12px;display:flex;justify-content:space-between;font-size:9px;letter-spacing:1px;font-weight:800;color:var(--muted)}
.connect{display:inline-block;margin-left:auto;margin-right:12px;padding:10px 11px;border:1.5px solid var(--blue);color:var(--blue);text-decoration:none;font:800 10px/1 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.35px}.connect:focus-visible{outline:2px solid var(--blue);outline-offset:3px}
.error{font-size:12px;color:#9b2929;margin-top:18px;min-height:18px}
.inbox{margin-top:54px;border-top:1.5px solid var(--rule);padding-top:20px}.inbox-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.inbox-kicker{font-size:10px;font-weight:850;letter-spacing:.5px;color:var(--muted)}.inbox h2{font-size:21px;line-height:1;margin:5px 0 0;letter-spacing:-.8px}.inbox button{border:1.5px solid var(--blue);background:transparent;color:var(--blue);padding:10px 12px;font:800 10px/1 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.35px;cursor:pointer}.inbox button:disabled{opacity:.45;cursor:not-allowed}.inbox-grid{display:grid;grid-template-columns:minmax(180px,250px) minmax(0,1fr);border:1.5px solid var(--rule);min-height:420px}.thread-list{border-right:1.5px solid var(--rule);max-height:560px;overflow:auto}.thread-item{display:block;width:100%;text-align:left;border:0!important;border-bottom:1px solid #d0cec5!important;padding:13px 12px!important;color:var(--ink)!important;letter-spacing:0!important}.thread-item.active{background:#e9e7df!important;border-left:4px solid var(--blue)!important;padding-left:8px!important}.thread-name{display:block;font-size:12px;font-weight:850;overflow-wrap:anywhere}.thread-sub{display:block;margin-top:5px;font-size:10px;color:var(--muted);font-weight:600}.chat-panel{min-width:0;display:flex;flex-direction:column}.chat-head{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:12px;border-bottom:1.5px solid var(--rule)}.chat-head strong{display:block;font-size:12px;overflow-wrap:anywhere}.chat-head small{display:block;margin-top:4px;color:var(--muted);font-size:10px}.chat-messages{height:330px;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:9px;background:#fbfaf6}.bubble{max-width:88%;padding:9px 11px;font-size:12px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}.bubble.user{align-self:flex-start;background:#e9e7df;color:var(--ink)}.bubble.assistant{align-self:flex-end;background:var(--blue);color:white}.bubble time{display:block;margin-top:5px;font-size:9px;opacity:.7}.reply-form{display:flex;gap:8px;padding:10px;border-top:1px solid #d0cec5}.reply-form textarea{flex:1;min-width:0;resize:vertical;min-height:42px;max-height:110px;border:1.5px solid var(--rule);border-radius:0;background:transparent;padding:10px;font:12px Inter,system-ui,sans-serif;color:var(--ink)}.reply-form button{align-self:stretch}.inbox-error{min-height:18px;margin:0;padding:0 10px 8px;color:#9b2929;font-size:10px}.inbox-note{padding:12px;color:var(--muted);font-size:11px}.customer-panel{padding:13px;border-top:1px solid #d0cec5;background:#f4f2eb}.customer-panel h3{font-size:10px;letter-spacing:.5px;margin:0 0 8px;color:var(--muted)}.customer-summary{font-size:11px;line-height:1.5;overflow-wrap:anywhere}.customer-facts{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.customer-fact{font-size:10px;padding:5px 7px;background:#e9e7df;overflow-wrap:anywhere}.customer-orders{margin-top:8px;font-size:10px;line-height:1.5;color:var(--ink)}.customer-orders div{padding:5px 0;border-top:1px solid #d0cec5}.inbox button:focus-visible,.reply-form textarea:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
@media(max-width:600px){.inbox-grid{grid-template-columns:1fr}.thread-list{border-right:0;border-bottom:1.5px solid var(--rule);max-height:190px}.chat-messages{height:340px}.chat-head{align-items:flex-start}.inbox h2{font-size:18px}}
@media(max-width:480px){main{padding:24px 20px 34px}header{margin-bottom:30px}.intro{grid-template-columns:42px 1fr;gap:12px;margin-bottom:58px}.index{font-size:26px}h1{font-size:clamp(31px,9vw,42px);letter-spacing:-2px}.metric-value{font-size:clamp(52px,15vw,68px);letter-spacing:-3.5px}.metric{margin-bottom:11px;padding-bottom:9px}}
</style>
</head>
<body>
<main>
<header>
  <div class="brand">CUSTOMPLATE®</div>
  <a class="connect" href="/auth/instagram">CONNECT INSTAGRAM</a>
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
<section class="inbox" aria-label="Instagram inbox">
  <div class="inbox-top">
    <div><div class="inbox-kicker">05 — CUSTOMER MESSAGES</div><h2>INSTAGRAM INBOX</h2></div>
    <div style="display:flex;gap:7px"><button id="subscribe-inbox" type="button">ENABLE WEBHOOKS</button><button id="refresh-inbox" type="button">REFRESH</button></div>
  </div>
  <div class="inbox-grid">
    <aside class="thread-list" id="thread-list" aria-label="Conversations"><div class="inbox-note">Loading conversations…</div></aside>
    <section class="chat-panel" aria-label="Selected conversation">
      <div class="chat-head"><div><strong id="chat-name">Choose a conversation</strong><small id="chat-meta">Customer history appears here</small></div><button id="pause-chat" type="button" disabled>PAUSE BOT</button></div>
      <div class="chat-messages" id="chat-messages"><div class="inbox-note">Select a conversation to view messages.</div></div>
      <section class="customer-panel" aria-label="Customer profile and order history">
        <h3>CUSTOMER MEMORY & ORDER HISTORY</h3>
        <div class="customer-summary" id="customer-summary">Select a conversation to view saved customer context.</div>
        <div class="customer-facts" id="customer-facts"></div>
        <div class="customer-orders" id="customer-orders"></div>
      </section>
      <form class="reply-form" id="reply-form"><textarea id="reply-text" maxlength="1000" placeholder="Write a reply…" aria-label="Reply text" disabled></textarea><button id="send-reply" type="submit" disabled>SEND</button></form>
      <p class="inbox-error" id="inbox-error" role="status"></p>
    </section>
  </div>
</section>
<footer><span>CUSTOMPLATE</span><span id="updated">LOADING</span></footer>
<div class="error" id="error" role="status"></div>
</main>
<script>
let password=sessionStorage.getItem('pw')||'';
async function api(url,options={}){
  let invalidAttempts=0;
  for(;;){
    if(!password){password=prompt('Dashboard password')||'';if(!password)throw new Error('Dashboard password is required.');}
    const auth=btoa(String.fromCharCode(...new TextEncoder().encode('admin:'+password)));
    const response=await fetch(url,{...options,headers:{...(options.headers||{}),Authorization:'Basic '+auth}});
    if(response.status===401){
      password='';sessionStorage.removeItem('pw');
      invalidAttempts++;
      if(invalidAttempts>=2)throw new Error('Incorrect dashboard password. Refresh the page and try again.');
      continue;
    }
    if(!response.ok){let message='Request failed ('+response.status+').';try{const payload=await response.clone().json();if(payload.error)message=payload.error;}catch{}throw new Error(message);}
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
    const range=document.getElementById('date-range').value;
    const start=rangeStart(range);
    const response=await api('/api/metrics?start='+encodeURIComponent(String(start)));
    const metrics=await response.json();
    document.getElementById('revenue').textContent=money(metrics.revenue);
    document.getElementById('conversations').textContent=Number(metrics.conversations||0).toLocaleString('en-IN');
    document.getElementById('paid-orders').textContent=Number(metrics.paid_orders||0).toLocaleString('en-IN');
    document.getElementById('pending').textContent=Number(metrics.pending_payments||0).toLocaleString('en-IN');
    document.getElementById('updated').textContent='UPDATED '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    document.getElementById('error').textContent='';
  }catch(error){
    document.getElementById('error').textContent=error.message;
    document.getElementById('updated').textContent='DATA UNAVAILABLE';
  }
}
document.getElementById('date-range').addEventListener('change',refresh);
let selectedConversation=null;
let conversationCache=[];
const threadList=document.getElementById('thread-list');
const chatMessages=document.getElementById('chat-messages');
const chatName=document.getElementById('chat-name');
const chatMeta=document.getElementById('chat-meta');
const inboxError=document.getElementById('inbox-error');
const customerSummary=document.getElementById('customer-summary');
const customerFacts=document.getElementById('customer-facts');
const customerOrders=document.getElementById('customer-orders');
const replyText=document.getElementById('reply-text');
const sendReply=document.getElementById('send-reply');
const pauseChat=document.getElementById('pause-chat');
const safeText=value=>String(value??'');
function renderThreads(){
  threadList.replaceChildren();
  if(!conversationCache.length){const empty=document.createElement('div');empty.className='inbox-note';empty.textContent='No Instagram conversations yet.';threadList.append(empty);return;}
  for(const convo of conversationCache){
    const button=document.createElement('button');button.type='button';button.className='thread-item'+(convo.ig_id===selectedConversation?' active':'');
    const name=document.createElement('span');name.className='thread-name';name.textContent=convo.username?'@'+convo.username:convo.ig_id;
    const sub=document.createElement('span');sub.className='thread-sub';sub.textContent=(convo.paused?'BOT PAUSED · ':'')+(convo.status||'chatting').replaceAll('_',' ').toUpperCase();
    button.append(name,sub);button.addEventListener('click',()=>selectConversation(convo.ig_id));threadList.append(button);
  }
}
async function loadMessages(id){
  const response=await api('/api/msgs/'+encodeURIComponent(id));const messages=await response.json();chatMessages.replaceChildren();
  if(!messages.length){const empty=document.createElement('div');empty.className='inbox-note';empty.textContent='No saved messages in this chat yet.';chatMessages.append(empty);return;}
  for(const message of messages){
    const bubble=document.createElement('div');bubble.className='bubble '+(message.role==='assistant'?'assistant':'user');
    const body=document.createElement('div');body.textContent=safeText(message.text);bubble.append(body);
    if(message.ts){const time=document.createElement('time');const stamp=Number(message.ts);time.textContent=new Date(stamp<1e12?stamp*1000:stamp).toLocaleString();bubble.append(time);}
    chatMessages.append(bubble);
  }
  chatMessages.scrollTop=chatMessages.scrollHeight;
}
async function loadCustomer(id){
  customerSummary.textContent='Loading customer details…';customerFacts.replaceChildren();customerOrders.replaceChildren();
  try{
    const response=await api('/api/customer/'+encodeURIComponent(id));
    const data=await response.json();
    customerSummary.textContent=data.summary||'No saved customer summary yet.';
    const facts=data.profile&&typeof data.profile==='object'?Object.entries(data.profile):[];
    for(const [key,value] of facts){
      const chip=document.createElement('span');chip.className='customer-fact';
      chip.textContent=key.replaceAll('_',' ')+': '+String(value);customerFacts.append(chip);
    }
    const orders=Array.isArray(data.orders)?data.orders:[];
    if(!orders.length){const empty=document.createElement('div');empty.textContent='No previous paid orders.';customerOrders.append(empty);}
    for(const item of orders.slice(0,5)){
      let order={};try{order=typeof item.order_json==='string'?JSON.parse(item.order_json):item.order_json||{};}catch{}
      const row=document.createElement('div');
      const paidAt=Number(item.paid_at||0);const date=paidAt?new Date(paidAt<1e12?paidAt*1000:paidAt).toLocaleDateString():'Date unavailable';
      row.textContent=date+' · '+String(order.vehicle||'Order')+' · '+String(order.plate_text||'Plate')+' · '+money(item.amount);
      customerOrders.append(row);
    }
  }catch(error){customerSummary.textContent=error.message;}
}
async function selectConversation(id){
  selectedConversation=id;const convo=conversationCache.find(item=>item.ig_id===id);
  chatName.textContent=convo?.username?'@'+convo.username:id;chatMeta.textContent=(convo?.status||'chatting').replaceAll('_',' ')+' · '+(convo?.paused?'Bot paused':'Bot active');
  pauseChat.disabled=false;pauseChat.textContent=convo?.paused?'RESUME BOT':'PAUSE BOT';replyText.disabled=false;sendReply.disabled=false;renderThreads();inboxError.textContent='';
  try{await Promise.all([loadMessages(id),loadCustomer(id)]);}catch(error){inboxError.textContent=error.message;}
}
async function refreshInbox(){
  try{const response=await api('/api/data');const data=await response.json();conversationCache=Array.isArray(data.convos)?data.convos:[];renderThreads();
    if(selectedConversation&&!conversationCache.some(item=>item.ig_id===selectedConversation))selectedConversation=null;
    if(!selectedConversation&&conversationCache.length)selectedConversation=conversationCache[0].ig_id;
    if(selectedConversation)await selectConversation(selectedConversation);
  }catch(error){inboxError.textContent=error.message;}
}
document.getElementById('refresh-inbox').addEventListener('click',refreshInbox);
document.getElementById('subscribe-inbox').addEventListener('click',async()=>{
  const button=document.getElementById('subscribe-inbox');button.disabled=true;inboxError.textContent='Subscribing this Instagram account to message webhooks…';
  try{const response=await api('/api/instagram/subscribe',{method:'POST'});const result=await response.json();inboxError.textContent=result.ok?'Instagram message webhook subscription enabled.':'Meta did not confirm the subscription; check the app webhook settings.';}
  catch(error){inboxError.textContent=error.message;}
  finally{button.disabled=false;}
});
document.getElementById('reply-form').addEventListener('submit',async event=>{
  event.preventDefault();if(!selectedConversation)return;const text=replyText.value.trim();if(!text)return;
  if(new TextEncoder().encode(text).length>1000){inboxError.textContent='Instagram message must be 1,000 UTF-8 bytes or fewer.';return;}
  sendReply.disabled=true;inboxError.textContent='Sending…';
  try{await api('/api/reply/'+encodeURIComponent(selectedConversation),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});replyText.value='';await loadMessages(selectedConversation);inboxError.textContent='Message sent.';}
  catch(error){inboxError.textContent=error.message;}
  finally{sendReply.disabled=false;}
});
pauseChat.addEventListener('click',async()=>{if(!selectedConversation)return;pauseChat.disabled=true;try{await api('/api/pause/'+encodeURIComponent(selectedConversation),{method:'POST'});await refreshInbox();}catch(error){inboxError.textContent=error.message;}finally{pauseChat.disabled=false;}});
refreshInbox();
setInterval(refreshInbox,20000);
refresh();
setInterval(refresh,15000);
</script>
</body>
</html>
`;