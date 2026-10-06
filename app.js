(() => {
  'use strict';
  const VERSION = '1.2.0';
  const SAVE_KEY = 'tvtycoon';
  const app = document.querySelector('#app');
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const slots = ['3–5 PM','5–6 PM','6–6:30 PM','6:30–8 PM','8–10 PM','10–11 PM'];
  const shows = [
    ['Children’s Club',2.7,90],['Homemaker Hour',2.2,65],['Western Film',4.4,135],
    ['Local Variety',4.1,180],['Local News',4.5,130],['Wrestling',6.2,210],
    ['Feature Film',5.2,240],['Live Variety Revue',5.8,320],['Local Drama',4.7,290],
    ['Late News',4.2,120],['Community Bulletin',1.7,35]
  ];
  const networks = {NBC:7.6,CBS:7.8,ABC:4.8,DuMont:4.1};
  const localProductions = new Set(['Local Variety','Local News','Live Variety Revue','Local Drama','Late News']);

  function freshState(){
    return {version:VERSION,week:1,cash:50000,rep:25,rating:0,hours:'3 PM–11 PM',camera:false,
      sched:Array.from({length:6},(_,i)=>Array.from({length:7},()=>shows[[0,3,4,2,7,9][i]][0])),
      tab:'Schedule',log:['January 1, 1950 — Your independent television station signs on.']};
  }
  function loadState(){
    try {
      const raw=localStorage.getItem(SAVE_KEY); if(!raw) return freshState();
      const parsed=JSON.parse(raw); const base=freshState();
      if(!parsed || typeof parsed!=='object') return base;
      const merged={...base,...parsed,version:VERSION};
      if(!Array.isArray(merged.sched)||merged.sched.length!==6) merged.sched=base.sched;
      if(!Array.isArray(merged.log)) merged.log=base.log;
      return merged;
    } catch(err){ console.warn('Save recovery:',err); return freshState(); }
  }
  let s=loadState();
  function save(){ try{localStorage.setItem(SAVE_KEY,JSON.stringify(s));}catch(err){console.warn('Save failed:',err);} }
  function dates(){const a=new Date(Date.UTC(1950,0,1+(s.week-1)*7));const b=new Date(a);b.setUTCDate(b.getUTCDate()+6);const f=d=>d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});return `${f(a)} – ${f(b)}`;}
  function getShow(name){return shows.find(x=>x[0]===name)||shows[0];}
  function nav(){return ['Schedule','Competition','Station','Finances','History'].map(x=>`<button data-tab="${x}" class="${s.tab===x?'active':''}">${x}</button>`).join('');}
  function schedule(){return `<div class="card schedule"><h2>Weekly Programming Log</h2><div class="muted">Sunday through Saturday. Every turn advances one full week.</div><table class="sched"><thead><tr><th>Time</th>${days.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${slots.map((t,i)=>`<tr><th>${t}</th>${days.map((d,j)=>`<td><select data-slot="${i}" data-day="${j}">${shows.map(x=>`<option ${s.sched[i][j]===x[0]?'selected':''}>${x[0]}</option>`).join('')}</select></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
  function competition(){const rows=[['CBS',networks.CBS],['NBC',networks.NBC],['Your Station',s.rating||'—'],['ABC',networks.ABC],['DuMont',networks.DuMont]];return `<div class="card"><h2>1950 Competitive Field</h2><p class="muted">Historical networks active in the national market. Their strength will change as television history progresses.</p>${rows.map(x=>`<div class="rank"><b>${x[0]}</b><span>${typeof x[1]==='number'?x[1].toFixed(1):x[1]}</span></div>`).join('')}</div>`;}
  function station(){return `<div class="grid"><div class="card"><h3>Broadcast Hours</h3><b>${s.hours}</b><p class="muted">Expansion is optional, never automatic.</p>${s.hours==='3 PM–11 PM'?'<button id="hours">Expand to 1 PM · $2,500</button>':'<span class="good">Expanded</span>'}</div><div class="card"><h3>Studio Cameras</h3><b>${s.camera?'Improved':'Basic 1950 setup'}</b><p class="muted">Better equipment improves locally produced programs.</p>${!s.camera?'<button id="camera">Upgrade · $7,500</button>':'<span class="good">Installed</span>'}</div></div>`;}
  function finances(){return `<div class="card"><h2>Station Ledger</h2><div class="rank"><span>Available cash</span><b>$${Math.round(s.cash).toLocaleString()}</b></div><div class="rank"><span>Reputation</span><b>${Math.round(s.rep)}/100</b></div><p class="muted">Advertising revenue and operating expenses are settled when you advance the week.</p></div>`;}
  function history(){return `<div class="card"><h2>Station History</h2>${s.log.slice().reverse().map(x=>`<p>${x}</p>`).join('')}</div>`;}
  function body(){return s.tab==='Schedule'?schedule():s.tab==='Competition'?competition():s.tab==='Station'?station():s.tab==='Finances'?finances():history();}
  function render(){app.innerHTML=`<div class="wrap"><div class="top"><div><div class="muted">WEEK ${s.week} · ${dates()}</div><h1>TV Station Tycoon</h1><div class="muted">Independent television · Historical Era · v${VERSION}</div></div><button id="advance" class="primary">Advance Week</button></div><div class="stats"><div class="stat"><span class="muted">Cash</span><br><b>$${Math.round(s.cash).toLocaleString()}</b></div><div class="stat"><span class="muted">Avg Rating</span><br><b>${s.rating?s.rating.toFixed(1):'—'}</b></div><div class="stat"><span class="muted">Reputation</span><br><b>${Math.round(s.rep)}/100</b></div><div class="stat"><span class="muted">Broadcast</span><br><b>${s.hours}</b></div></div><div class="tabs">${nav()}</div>${body()}</div>`;bind();}
  function advance(){let ratingTotal=0,revenue=0,cost=2100,count=0;s.sched.forEach(row=>row.forEach(name=>{const x=getShow(name);const cameraBonus=(s.camera&&localProductions.has(name))?0.65:0;const rating=x[1]+(Math.random()-0.5)*1.8+s.rep/100+cameraBonus;ratingTotal+=Math.max(0,rating);revenue+=x[2]*(0.8+Math.random()*0.4);cost+=x[2]*0.48;count++;}));if(s.hours!=='3 PM–11 PM')cost+=500;s.rating=ratingTotal/count;const net=revenue-cost;s.cash+=net;s.rep=Math.max(0,Math.min(100,s.rep+(s.rating>5?0.7:-0.15)));s.log.push(`Week ${s.week}: rating ${s.rating.toFixed(1)}; ${net>=0?'profit':'loss'} $${Math.abs(Math.round(net)).toLocaleString()}.`);s.week++;save();render();}
  function bind(){document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{s.tab=b.dataset.tab;save();render();});document.querySelectorAll('select[data-slot]').forEach(e=>e.onchange=()=>{s.sched[Number(e.dataset.slot)][Number(e.dataset.day)]=e.value;save();});const a=document.querySelector('#advance');if(a)a.onclick=advance;const h=document.querySelector('#hours');if(h)h.onclick=()=>{if(s.cash>=2500){s.cash-=2500;s.hours='1 PM–11 PM';s.log.push('Expanded broadcast day to 1 PM.');save();render();}};const c=document.querySelector('#camera');if(c)c.onclick=()=>{if(s.cash>=7500){s.cash-=7500;s.camera=true;s.log.push('Purchased improved studio camera equipment.');save();render();}};}
  function fatal(err){console.error(err);app.innerHTML=`<div class="fatal"><h1>TV Station Tycoon couldn't start</h1><p>The app hit an error instead of leaving you with a blank screen.</p><div class="error-details">${String(err&&err.stack?err.stack:err).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</div><p><button class="danger" id="reset-save">Reset local save and retry</button></p></div>`;const r=document.querySelector('#reset-save');if(r)r.onclick=()=>{localStorage.removeItem(SAVE_KEY);location.reload();};}
  window.addEventListener('error',event=>{if(!app.querySelector('.wrap'))fatal(event.error||event.message);});
  try{render();}catch(err){fatal(err);return;}
  if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(reg=>reg.update()).catch(err=>console.warn('Service worker:',err)));}
})();
