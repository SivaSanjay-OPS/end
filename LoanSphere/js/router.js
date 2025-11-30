<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>LoanSphere v2 — SPA (Frontend + Pluggable API)</title>

<!-- =========================
     Styles (single-file)
========================= -->
<style>
:root{
  --bg:#f4f8ff; --panel:#ffffff; --muted:#6b7280;
  --accent-blue:#0b76ff; --accent-green:#10b981; --accent-red:#ef4444;
  --accent-purple:#7c3aed; --accent-orange:#f97316;
  --glass: rgba(255,255,255,0.85); --radius:12px; --shadow: 0 14px 40px rgba(12,22,60,0.08);
  --maxw:1240px;
  --ease: cubic-bezier(.2,.9,.25,1);
}
*{box-sizing:border-box}
html,body{height:100%;margin:0;font-family:Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; background:linear-gradient(180deg,#eef6ff,#fff);color:#0f172a; -webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.app{max-width:var(--maxw);margin:28px auto;border-radius:14px;overflow:hidden;box-shadow:var(--shadow);display:flex;min-height:680px;background:linear-gradient(180deg,#ffffff,#fbfdff)}
.left{width:260px;background:linear-gradient(180deg,#ffffff,#f6fbff);padding:20px;border-right:1px solid rgba(15,23,42,0.04);display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:12px}
.logo{width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,var(--accent-blue),#005ecc);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;box-shadow:0 6px 18px rgba(11,118,255,0.12)}
.app-title{font-weight:800;font-size:18px}
.small{font-size:13px;color:var(--muted)}
.nav{display:flex;flex-direction:column;gap:6px;margin-top:14px}
.nav button{background:transparent;border:0;padding:12px;border-radius:10px;text-align:left;cursor:pointer;font-weight:700;color:#0f172a;transition:background .18s var(--ease), transform .12s var(--ease)}
.nav button:hover{background:rgba(11,118,255,0.06); transform:translateX(3px)}
.nav button.active{background:linear-gradient(90deg, rgba(11,118,255,0.12), rgba(11,118,255,0.06));box-shadow:inset 0 0 0 1px rgba(11,118,255,0.03)}
.foot{margin-top:auto;font-size:12px;color:var(--muted)}

/* main */
.main{flex:1;display:flex;flex-direction:column;min-width:0}
.topbar{display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-bottom:1px solid rgba(15,23,42,0.04);gap:10px}
.top-left{display:flex;align-items:baseline;gap:12px}
.title{font-weight:800;font-size:18px}
.subtitle{font-size:13px;color:var(--muted)}
.top-right{display:flex;align-items:center;gap:12px}
.search{padding:8px 12px;border-radius:10px;border:1px solid rgba(15,23,42,0.06);min-width:260px;transition:box-shadow .12s ease}
.search:focus{box-shadow:0 8px 30px rgba(11,118,255,0.08);outline:none}
.profile{display:flex;align-items:center;gap:10px}
.avatar{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#0b76ff,#0a66d6);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;box-shadow:0 6px 18px rgba(11,118,255,0.12)}
.themeDot{width:8px;height:8px;border-radius:99px;background:var(--accent-blue);display:inline-block;box-shadow:0 4px 10px rgba(11,118,255,0.08)}

/* content */
.content{padding:18px;overflow:auto;display:flex;flex-direction:column;gap:12px}
.header-grid{display:flex;gap:12px;flex-wrap:wrap}
.card{background:var(--panel);padding:14px;border-radius:12px;box-shadow:0 8px 22px rgba(12,22,40,0.04);min-width:200px;flex:1;transition:transform .18s var(--ease)}
.card:hover{transform:translateY(-6px)}
.metric{font-size:20px;font-weight:800}
.muted{color:var(--muted)}

/* panels */
.panel{display:none}
.panel.active{display:block;animation:fadeIn .36s var(--ease) both}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

/* lists */
.list{display:flex;flex-direction:column;gap:10px}
.item{background:#fff;padding:12px;border-radius:10px;border:1px solid rgba(12,22,40,0.03);display:flex;justify-content:space-between;align-items:center}
.actions{display:flex;gap:8px}

/* forms */
.form-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}
.input,select,textarea{padding:10px;border-radius:10px;border:1px solid rgba(15,23,42,0.06);min-width:0;font-size:14px}
textarea{min-height:80px;resize:vertical}

/* plans */
.plan-grid{display:flex;gap:12px;flex-wrap:wrap}
.plan{flex:1;min-width:200px;padding:14px;border-radius:12px;background:linear-gradient(180deg,#fff,#fbfeff);border:1px solid rgba(11,118,255,0.06)}
.plan .title{font-weight:800}
.plan .price{font-size:20px;margin-top:8px}

/* modal */
.modal-backdrop{position:fixed;inset:0;background:rgba(8,10,20,0.45);display:flex;align-items:center;justify-content:center;z-index:200;opacity:0;pointer-events:none;transition:opacity .18s}
.modal-backdrop.show{opacity:1;pointer-events:auto}
.modal{background:#fff;padding:16px;border-radius:12px;max-width:860px;width:94%;box-shadow:0 18px 60px rgba(12,22,40,0.3);transform:scale(.96);transition:transform .18s}
.modal-backdrop.show .modal{transform:scale(1)}
.modal .head{display:flex;justify-content:space-between;align-items:center}

/* toast */
.toasts{position:fixed;right:18px;bottom:18px;z-index:300;display:flex;flex-direction:column;gap:8px}
.toast{background:#111;color:#fff;padding:10px 12px;border-radius:8px;box-shadow:0 8px 24px rgba(12,22,40,0.2);opacity:0;transform:translateY(8px);animation:toastIn .28s forwards}
@keyframes toastIn{to{opacity:1;transform:none}}

/* credit bar */
.credit-bar{height:12px;border-radius:8px;background:#eef2ff;overflow:hidden;margin-top:8px}
.credit-fill{height:100%;width:0;background:linear-gradient(90deg,var(--accent-green),#0b76ff);transition:width .4s var(--ease)}

/* responsive */
@media (max-width:980px){
  .left{display:none}
  .search{display:none}
  .app{margin:10px}
}
</style>

</head>
<body>

<div class="app" role="application" aria-label="LoanSphere v2">
  <!-- LEFT NAV -->
  <aside class="left" aria-label="Main navigation">
    <div class="brand">
      <div class="logo">LS</div>
      <div>
        <div class="app-title">LoanSphere</div>
        <div class="small">Frontend Demo v2</div>
      </div>
    </div>

    <nav class="nav" id="nav">
      <button class="nav-btn active" data-panel="dashboard">Overview</button>
      <button class="nav-btn" data-panel="lender">Lender</button>
      <button class="nav-btn" data-panel="borrower">Borrower</button>
      <button class="nav-btn" data-panel="admin">Admin</button>
      <button class="nav-btn" data-panel="analyst">Analyst</button>
      <button class="nav-btn" data-panel="hr">HR</button>
    </nav>

    <div class="foot small">No backend required • localStorage • Toggle to use real API</div>
  </aside>

  <!-- MAIN -->
  <main class="main">
    <header class="topbar">
      <div class="top-left">
        <div class="title">LoanSphere v2</div>
        <div class="subtitle muted">Role-based SPA • EMI, docs, credit score, exports</div>
      </div>

      <div class="top-right">
        <input id="globalSearch" class="search" placeholder="Search loans/users/offers..." />
        <div class="profile" title="Theme color">
          <div class="avatar" id="avatar">A</div>
        </div>
      </div>
    </header>

    <section class="content">

      <!-- header metrics -->
      <div class="header-grid">
        <div class="card">
          <div class="small">Total Loans</div>
          <div class="metric" id="mTotalLoans">0</div>
          <div class="muted">Loan records stored</div>
        </div>
        <div class="card">
          <div class="small">Pending Docs</div>
          <div class="metric" id="mPendingDocs">0</div>
          <div class="muted">Awaiting admin review</div>
        </div>
        <div class="card">
          <div class="small">Marketplace Offers</div>
          <div class="metric" id="mOffers">0</div>
          <div class="muted">Published offers</div>
        </div>
      </div>

      <!-- PANELS -->
      <section id="dashboard" class="panel active" aria-live="polite">
        <div class="card">
          <h3>Overview</h3>
          <p class="muted">All dashboards live on the same page. Switch from left navigation.</p>
          <div style="display:flex;gap:12px;margin-top:12px">
            <div style="flex:1">
              <div class="small">Recent Loans</div>
              <div id="recentLoans" class="list"></div>
            </div>
            <div style="width:320px">
              <div class="small">Pending Documents</div>
              <div id="dashPending" class="list"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Lender -->
      <section id="lender" class="panel" aria-hidden="true">
        <div class="card">
          <h3>Lender — Create Offers</h3>

          <div class="form-row">
            <input id="offerTitle" class="input" placeholder="Offer title (Student Loan)">
            <input id="offerPrincipal" class="input" placeholder="Principal (₹)">
            <input id="offerRate" class="input" placeholder="Annual rate (%)">
            <input id="offerTerm" class="input" placeholder="Term (months)">
            <button id="createOffer" class="btn primary">Create</button>
          </div>

          <div style="margin-top:12px">
            <h4>Offers</h4>
            <div id="offersList" class="list"></div>
          </div>

          <div style="margin-top:12px">
            <h4>Marketplace</h4>
            <div id="marketList" class="list"></div>
          </div>
        </div>
      </section>

      <!-- Borrower -->
      <section id="borrower" class="panel" aria-hidden="true">
        <div class="card">
          <h3>Borrower — Plans, Apply, Upload</h3>

          <div>
            <h4>Plans</h4>
            <div id="plansArea" class="plan-grid"></div>
          </div>

          <div style="margin-top:12px">
            <h4>Marketplace</h4>
            <div id="borrowMarket" class="list"></div>
          </div>

          <div style="margin-top:12px">
            <h4>Upload Docs (PDF/JPG/PNG — max 4MB)</h4>
            <div class="form-row">
              <input id="bName" class="input" placeholder="Your full name">
              <input id="bEmail" class="input" placeholder="Your email">
              <input id="bFile" type="file" accept=".pdf,image/png,image/jpeg">
              <button id="uploadDoc" class="btn ok">Upload</button>
            </div>
            <div id="uploadMsg" class="small" style="margin-top:6px"></div>
          </div>

          <div style="margin-top:12px">
            <h4>My Loans & Payments</h4>
            <div id="myLoans" class="list"></div>
          </div>

          <div style="margin-top:12px">
            <h4>Credit Score</h4>
            <div id="creditScoreWrap">
              <div class="small">Score: <strong id="scoreVal">—</strong></div>
              <div class="credit-bar"><div id="creditFill" class="credit-fill"></div></div>
            </div>
            <div class="muted" style="margin-top:6px">Score improves when docs accepted and payments are timely.</div>
          </div>
        </div>
      </section>

      <!-- Admin -->
      <section id="admin" class="panel" aria-hidden="true">
        <div class="card">
          <h3>Admin — Review Documents</h3>
          <div>
            <h4>Pending Documents</h4>
            <div id="pendingQueue" class="list"></div>
          </div>

          <div style="margin-top:12px">
            <h4>Loans</h4>
            <div id="adminLoans" class="list"></div>
          </div>

          <div style="margin-top:12px">
            <h4>Users</h4>
            <div id="adminUsers" class="list"></div>
          </div>
        </div>
      </section>

      <!-- Analyst -->
      <section id="analyst" class="panel" aria-hidden="true">
        <div class="card">
          <h3>Analyst — Charts & Export</h3>
          <div class="canvas-wrap">
            <canvas id="analystCanvas" width="740" height="220"></canvas>
          </div>

          <div style="margin-top:10px" class="row">
            <button id="exportLoans" class="btn primary">Export Loans CSV</button>
            <button id="exportPayments" class="btn">Export Payments CSV</button>
          </div>
        </div>
      </section>

      <!-- HR -->
      <section id="hr" class="panel" aria-hidden="true">
        <div class="card">
          <h3>HR — Users & Roles</h3>
          <div id="hrUsers" class="list"></div>
        </div>
      </section>
    </section>
  </main>
</div>

<!-- Modal for previews -->
<div id="modalBackdrop" class="modal-backdrop" aria-hidden="true">
  <div class="modal" role="dialog" aria-modal="true">
    <div class="head" style="display:flex;justify-content:space-between;align-items:center">
      <div><strong id="modalTitle">Preview</strong></div>
      <div><button id="closeModal" class="btn">Close</button></div>
    </div>
    <div id="modalBody" style="margin-top:12px"></div>
  </div>
</div>

<!-- Toasts -->
<div class="toasts" id="toasts"></div>

<!-- =========================
     JavaScript — All logic
========================= -->
<script>
/* ===================================================
   CONFIG: Toggle real API integration vs localStorage
   - USE_API: false => localStorage fallback (default)
   - If you set USE_API = true, provide API_BASE and endpoints
   =================================================== */
const USE_API = false; // toggle to true if you have backend
const API_BASE = 'https://example.com/api'; // replace with your backend base

/* =========================
   Pluggable API layer
   - If USE_API==true, functions call fetch()
   - Otherwise they use localStorage via DB.*
   - This keeps the UI identical and makes backend wiring easy.
   ========================= */
const DB = {
  get(key){ try{ return JSON.parse(localStorage.getItem(key)||'null') }catch(e){ return null } },
  set(key,val){ localStorage.setItem(key, JSON.stringify(val)) },
  add(key,val){ const arr = DB.get(key)||[]; arr.push(val); DB.set(key,arr); return arr }
};

const API = {
  async list(key){ // e.g. 'offers', 'loans'
    if(!USE_API) return (DB.get(key) || []);
    const res = await fetch(`${API_BASE}/${key}`); return res.ok? await res.json() : [];
  },
  async get(key, id){
    if(!USE_API) return (DB.get(key)||[]).find(x=> x.id == id) || null;
    const res = await fetch(`${API_BASE}/${key}/${id}`); return res.ok? await res.json() : null;
  },
  async create(key, obj){
    if(!USE_API){ const arr = DB.get(key)||[]; arr.push(obj); DB.set(key,arr); return obj; }
    const res = await fetch(`${API_BASE}/${key}`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(obj)}); return res.ok? await res.json():null;
  },
  async update(key, id, patch){
    if(!USE_API){ const arr = DB.get(key)||[]; const i = arr.findIndex(x=> x.id==id); if(i===-1) return null; arr[i] = {...arr[i], ...patch}; DB.set(key,arr); return arr[i]; }
    const res = await fetch(`${API_BASE}/${key}/${id}`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(patch)}); return res.ok? await res.json():null;
  },
  async remove(key, id){
    if(!USE_API){ let arr = DB.get(key)||[]; arr = arr.filter(x=> x.id != id); DB.set(key,arr); return true; }
    const res = await fetch(`${API_BASE}/${key}/${id}`, {method:'DELETE'}); return res.ok;
  }
};

/* =========================
   Toast notifications
========================= */
function toast(msg, ms=2800){
  const t = document.createElement('div'); t.className='toast'; t.textContent = msg; document.getElementById('toasts').appendChild(t);
  setTimeout(()=> t.style.opacity='1', 10);
  setTimeout(()=> { t.style.opacity='0'; t.addEventListener('transitionend', ()=> t.remove()) }, ms);
}

/* =========================
   Demo seeding (only if empty)
========================= */
(function seed(){
  if(!DB.get('offers')) DB.set('offers', [
    {id:101, title:'Std Student', principal:50000, rate:10, term:24, owner:'LenderA'},
    {id:102, title:'Quick Personal', principal:20000, rate:16, term:12, owner:'LenderA'}
  ]);
  if(!DB.get('market')) DB.set('market', [...DB.get('offers') || []]);
  if(!DB.get('loans')) DB.set('loans', []);
  if(!DB.get('users')) DB.set('users', []);
  if(!DB.get('pendingDocs')) DB.set('pendingDocs', []);
  if(!DB.get('reviewedDocs')) DB.set('reviewedDocs', []);
  if(!DB.get('transactions')) DB.set('transactions', []);
})();

/* =========================
   Helpers & UI plumbing
========================= */
function $(s){ return document.querySelector(s) }
function $all(s){ return Array.from(document.querySelectorAll(s)) }

const navBtns = $all('.nav-btn');
navBtns.forEach(b=> b.addEventListener('click', ()=> switchPanel(b.dataset.panel)));

function switchPanel(panel){
  navBtns.forEach(nb=> nb.classList.toggle('active', nb.dataset.panel===panel));
  $all('.panel').forEach(p=> p.classList.toggle('active', p.id===panel));
  refreshAll();
}

/* metrics */
async function refreshMetrics(){
  const loans = await API.list('loans'); const pending = await API.list('pendingDocs'); const market = await API.list('market');
  $('#mTotalLoans').textContent = loans.length; $('#mPendingDocs').textContent = pending.length; $('#mOffers').textContent = market.length;
}

/* =========================
   Dashboard rendering
========================= */
async function renderRecentLoans(){
  const loans = await API.list('loans'); const recent = loans.slice(-6).reverse();
  const container = $('#recentLoans'); container.innerHTML='';
  if(!recent.length) container.innerHTML = '<div class="small">No loans yet.</div>';
  recent.forEach(l=>{
    const node = document.createElement('div'); node.className='item';
    node.innerHTML = `<div><strong>${escapeHtml(l.title)}</strong><div class="small">${escapeHtml(l.borrowerName||'—')} • ₹${l.principal} • ${l.rate}%</div></div>
      <div class="actions"><button class="btn" onclick="openLoanModal(${l.id})">Details</button></div>`;
    container.appendChild(node);
  });
}
async function renderDashPending(){
  const pending = await API.list('pendingDocs'); const container = $('#dashPending'); container.innerHTML='';
  if(!pending.length) container.innerHTML = '<div class="small">No pending documents.</div>';
  pending.slice(-6).reverse().forEach(p=>{
    const node = document.createElement('div'); node.className='item';
    node.innerHTML = `<div><strong>${escapeHtml(p.name)}</strong><div class="small">From ${escapeHtml(p.borrower)} • ${new Date(p.date).toLocaleString()}</div></div>
      <div class="actions"><button class="btn" onclick="previewDoc('${p.id}')">View</button></div>`;
    container.appendChild(node);
  });
}

/* =========================
   LENDER: create/publish offers
========================= */
$('#createOffer')?.addEventListener('click', async ()=>{
  const title = $('#offerTitle').value.trim();
  const p = Number($('#offerPrincipal').value);
  const r = Number($('#offerRate').value);
  const t = Number($('#offerTerm').value);
  if(!title || !p || !r || !t) return toast('Please fill all offer fields');
  const offer = { id: Date.now(), title, principal: p, rate: r, term: t, owner: 'You', createdAt: Date.now() };
  await API.create('offers', offer);
  toast('Offer created');
  $('#offerTitle').value=''; $('#offerPrincipal').value=''; $('#offerRate').value=''; $('#offerTerm').value='';
  await renderOffers(); await renderMarket(); await refreshMetrics();
});

async function renderOffers(){
  const offers = await API.list('offers'); const container = $('#offersList'); container.innerHTML='';
  if(!offers.length) container.innerHTML = '<div class="small">No offers created.</div>';
  offers.forEach(o=>{
    const el = document.createElement('div'); el.className='item';
    el.innerHTML = `<div><strong>${escapeHtml(o.title)}</strong><div class="small">₹${o.principal} • ${o.rate}% • ${o.term} months</div></div>
      <div class="actions">
        <button class="btn" onclick="publishOffer(${o.id})">Publish</button>
        <button class="btn" onclick="deleteOffer(${o.id})">Delete</button>
      </div>`;
    container.appendChild(el);
  });
}
async function renderMarket(){
  const market = await API.list('market'); const container = $('#marketList'); container.innerHTML='';
  if(!market.length) container.innerHTML = '<div class="small">No marketplace offers.</div>';
  market.forEach(m=>{
    const el = document.createElement('div'); el.className='item';
    el.innerHTML = `<div><strong>${escapeHtml(m.title)}</strong><div class="small">₹${m.principal} • ${m.rate}% • ${m.term} months</div></div>
      <div class="actions"><button class="btn primary" onclick="applyFromMarket(${m.id})">Apply</button></div>`;
    container.appendChild(el);
  });
}
async function publishOffer(id){
  const offer = (await API.list('offers')).find(o=> o.id==id);
  if(!offer) return toast('Offer not found');
  const market = await API.list('market'); market.push(offer); await API.create('market', offer); // local create duplicates nicely
  toast('Published to marketplace');
  await renderMarket(); await refreshMetrics();
}
async function deleteOffer(id){
  // remove from offers and market (local)
  let offers = await API.list('offers'); offers = offers.filter(o=> o.id != id); DB.set('offers', offers);
  let market = await API.list('market'); market = market.filter(m=> m.id != id); DB.set('market', market);
  toast('Offer deleted'); await renderOffers(); await renderMarket(); await refreshMetrics();
}

/* =========================
   BORROWER: plans, apply, upload, credit
========================= */
const PLANS = [
  {id:'planA', title:'Starter Student', principal:30000, rate:9.5, term:24, desc:'Low-rate student plan'},
  {id:'planB', title:'Grad Personal', principal:60000, rate:12, term:36, desc:'Flexible personal loan'},
  {id:'planC', title:'Quick Cash', principal:15000, rate:18, term:6, desc:'Fast small loans'}
];

function renderPlans(){
  const area = $('#plansArea'); area.innerHTML='';
  PLANS.forEach(p=>{
    const box = document.createElement('div'); box.className='plan';
    box.innerHTML = `<div class="title">${escapeHtml(p.title)}</div>
      <div class="small">${escapeHtml(p.desc)}</div>
      <div class="price">₹${p.principal}</div>
      <div class="small">Rate: ${p.rate}% • ${p.term} months</div>
      <div style="margin-top:10px;"><button class="btn" onclick='applyPlan("${p.id}")'>Apply</button></div>`;
    area.appendChild(box);
  });
}

async function renderBorrowMarket(){
  const market = await API.list('market'); const cont = $('#borrowMarket'); cont.innerHTML='';
  if(!market.length) cont.innerHTML = '<div class="small">No marketplace offers</div>';
  market.forEach(m=>{
    const el = document.createElement('div'); el.className='item';
    el.innerHTML = `<div><strong>${escapeHtml(m.title)}</strong><div class="small">₹${m.principal} • ${m.rate}% • ${m.term} months</div></div>
      <div class="actions"><button class="btn primary" onclick="applyFromMarket(${m.id})">Apply</button></div>`;
    cont.appendChild(el);
  });
}

async function applyFromMarket(id){
  const market = await API.list('market'); const offer = market.find(x=> x.id==id);
  if(!offer) return toast('Offer not available');
  const name = prompt('Your full name'); const email = prompt('Your email');
  if(!name || !email) return toast('Name and email required');
  await createLoanFromOffer(offer, name, email);
}

async function applyPlan(planId){
  const plan = PLANS.find(x=> x.id===planId);
  if(!plan) return;
  const name = prompt('Your full name'); const email = prompt('Your email');
  if(!name || !email) return toast('Name and email required');
  await createLoanFromOffer(plan, name, email);
}

async function createLoanFromOffer(offer, name, email){
  // EMI calc and schedule
  const P = Number(offer.principal); const annualRate = Number(offer.rate); const n = Number(offer.term);
  const monthlyRate = annualRate/100/12;
  let emi = 0;
  if(monthlyRate === 0) emi = P/n; else emi = (P*monthlyRate)/(1-Math.pow(1+monthlyRate,-n));
  emi = Math.round(emi*100)/100;
  let balance = P; const schedule=[];
  for(let i=1;i<=n;i++){
    const interest = Math.round(balance*monthlyRate*100)/100;
    const principal = Math.round((emi - interest)*100)/100;
    balance = Math.round(Math.max(0, balance - principal)*100)/100;
    schedule.push({month:i,payment:emi,interest,principal,balance,paid:false});
  }
  const loan = { id: Date.now(), title: offer.title, principal: P, rate: annualRate, termMonths: n, emi, borrowerName: name, borrowerEmail: email, schedule, status: 'applied', createdAt: Date.now() };
  await API.create('loans', loan);
  let users = DB.get('users')||[]; if(!users.find(u=> u.email===email)){ users.push({name,email,role:'borrower'}); DB.set('users', users); }
  toast('Application submitted — upload documents next');
  await renderMyLoans(); await renderRecentLoans(); await renderAdminLoans(); await refreshMetrics();
}

/* upload document (borrowser) */
$('#uploadDoc')?.addEventListener('click', async ()=>{
  const name = $('#bName').value.trim(); const email = $('#bEmail').value.trim();
  const file = $('#bFile').files[0];
  if(!name || !email){ $('#uploadMsg').textContent = 'Enter name & email'; return; }
  if(!file){ $('#uploadMsg').textContent = 'Select a file'; return; }
  const allowed = ['application/pdf','image/png','image/jpeg'];
  if(!allowed.includes(file.type)){ $('#uploadMsg').textContent = 'Only PDF/JPG/PNG allowed'; return; }
  if(file.size > 4 * 1024 * 1024){ $('#uploadMsg').textContent = 'File too large (max 4MB)'; return; }
  $('#uploadMsg').textContent = 'Uploading...';
  const reader = new FileReader();
  reader.onload = async ()=> {
    const data = reader.result;
    const doc = { id: Date.now().toString(), name: file.name, type: file.type, data, borrower: name, borrowerEmail: email, date: Date.now() };
    await API.create('pendingDocs', doc);
    let users = DB.get('users')||[]; if(!users.find(u=> u.email===email)){ users.push({name,email,role:'borrower'}); DB.set('users', users); }
    $('#uploadMsg').textContent = 'Uploaded and queued for admin review';
    $('#bFile').value=''; await refreshMetrics(); await renderPendingQueue();
    toast('File uploaded');
  };
  reader.readAsDataURL(file);
});

/* render my loans */
async function renderMyLoans(){
  const email = $('#bEmail').value.trim() || '';
  const loans = await API.list('loans'); const my = email ? loans.filter(l=> l.borrowerEmail===email) : loans.slice(-6).reverse();
  const container = $('#myLoans'); container.innerHTML='';
  if(!my.length) container.innerHTML = '<div class="small">No loans for this email (enter email above)</div>';
  my.forEach(l=>{
    const paidCount = l.schedule.filter(s=> s.paid).length;
    const el = document.createElement('div'); el.className='item';
    el.innerHTML = `<div><strong>${escapeHtml(l.title)}</strong><div class="small">EMI: ₹${l.emi} • ${l.termMonths} months • Paid ${paidCount}/${l.termMonths}</div></div>
      <div class="actions">
        <button class="btn" onclick="openLoanModal(${l.id})">Details</button>
        <button class="btn" onclick="simulatePay(${l.id})">Pay next EMI</button>
      </div>`;
    container.appendChild(el);
  });
  updateCreditScore(email);
}

/* simulate payment */
async function simulatePay(loanId){
  const loans = await API.list('loans'); const loan = loans.find(l=> l.id == loanId);
  if(!loan) return toast('Loan not found');
  const next = loan.schedule.find(s=> !s.paid);
  if(!next) return toast('All payments completed');
  next.paid = true; next.paidAt = Date.now();
  // save loan (update)
  await API.update('loans', loan.id, loan);
  // record transaction
  const tx = { id: Date.now(), loanId: loan.id, amount: next.payment, month: next.month, at: Date.now(), by: loan.borrowerEmail };
  await API.create('transactions', tx);
  toast(`Payment recorded (month ${next.month})`);
  await renderMyLoans(); await renderAdminLoans(); await refreshMetrics(); updateCreditScore(loan.borrowerEmail);
}

/* credit score logic & UI */
function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
function computeCreditScore(email){
  if(!email) return null;
  const loans = DB.get('loans') || []; const reviewed = DB.get('reviewedDocs') || []; const userLoans = loans.filter(l=> l.borrowerEmail===email);
  let score = 500;
  reviewed.filter(d=> d.borrowerEmail===email).forEach(d => score += (d.status === 'accepted' ? 40 : -20));
  userLoans.forEach(l=>{
    const total = l.schedule.length; const paid = l.schedule.filter(s=> s.paid).length; const ratio = total? paid/total:0;
    score += Math.round(ratio * 150);
    if(ratio < 0.5) score -= 40;
    if(l.rate > 18) score -= 10;
  });
  return clamp(score, 300, 850);
}
function updateCreditScore(email){
  if(!email){ $('#scoreVal').textContent = '—'; $('#creditFill').style.width = '0%'; return; }
  const score = computeCreditScore(email) || 400; $('#scoreVal').textContent = score;
  // map 300..850 to 0..100%
  const pct = Math.round((score - 300) / (850 - 300) * 100);
  $('#creditFill').style.width = pct + '%';
  // save to user
  let users = DB.get('users')||[]; const idx = users.findIndex(u=> u.email===email);
  if(idx>-1){ users[idx].credit = score; DB.set('users', users); }
}

/* =========================
   Admin: pending docs review
========================= */
async function renderPendingQueue(){
  const pending = await API.list('pendingDocs'); const container = $('#pendingQueue'); container.innerHTML='';
  if(!pending.length) container.innerHTML = '<div class="small">No pending documents.</div>';
  pending.forEach((p, idx) => {
    const el = document.createElement('div'); el.className='item';
    el.innerHTML = `<div style="max-width:70%"><strong>${escapeHtml(p.name)}</strong>
      <div class="small">From ${escapeHtml(p.borrower)} • ${new Date(p.date).toLocaleString()}</div></div>
      <div class="actions">
        <button class="btn" onclick="previewDoc('${p.id}')">View</button>
        <button class="btn ok" onclick="reviewDoc(${idx}, true)">Accept</button>
        <button class="btn warn" onclick="reviewDoc(${idx}, false)">Reject</button>
        <button class="btn" onclick="downloadDoc('${p.id}')">Download</button>
      </div>`;
    container.appendChild(el);
  });
}
async function reviewDoc(index, accept){
  const pending = DB.get('pendingDocs') || []; const item = pending[index];
  if(!item) return toast('Document not found');
  const reason = prompt('Enter reason (optional)');
  const reviewed = DB.get('reviewedDocs') || []; reviewed.push({...item, status: accept? 'accepted': 'rejected', reason: reason || '', reviewedAt: Date.now() });
  DB.set('reviewedDocs', reviewed);
  // update user status
  let users = DB.get('users') || []; const uidx = users.findIndex(u=> u.email === item.borrowerEmail);
  if(uidx>-1){ users[uidx].docStatus = accept? 'accepted':'rejected'; users[uidx].docReason = reason || ''; DB.set('users', users); }
  // remove from pending
  pending.splice(index, 1); DB.set('pendingDocs', pending);
  toast('Document reviewed');
  await renderPendingQueue(); await renderAdminUsers(); await refreshMetrics();
}

/* preview and download */
function previewDoc(id){
  const pending = DB.get('pendingDocs') || []; const reviewed = DB.get('reviewedDocs') || [];
  const p = pending.find(x=> x.id==id) || reviewed.find(x=> x.id==id);
  if(!p) return toast('File not found');
  $('#modalTitle').textContent = p.name;
  const body = $('#modalBody'); body.innerHTML = '';
  if(p.type === 'application/pdf'){
    const iframe = document.createElement('iframe'); iframe.src = p.data; iframe.style.width='100%'; iframe.style.height='500px'; iframe.style.border='0';
    body.appendChild(iframe);
  } else {
    const img = document.createElement('img'); img.src = p.data; img.style.maxWidth='100%'; img.style.borderRadius='8px';
    body.appendChild(img);
  }
  showModal(true);
}
function downloadDoc(id){
  const pending = DB.get('pendingDocs') || []; const reviewed = DB.get('reviewedDocs') || [];
  const p = pending.find(x=> x.id==id) || reviewed.find(x=> x.id==id);
  if(!p) return toast('Not found');
  const a = document.createElement('a'); a.href = p.data; a.download = p.name; a.click();
}

/* =========================
   Admin: render loans & users
========================= */
async function renderAdminLoans(){
  const loans = await API.list('loans'); const container = $('#adminLoans'); container.innerHTML='';
  if(!loans.length) container.innerHTML = '<div class="small">No loans</div>';
  loans.forEach(l=>{
    const el = document.createElement('div'); el.className='item';
    const paid = l.schedule.filter(s=> s.paid).length;
    el.innerHTML = `<div><strong>${escapeHtml(l.title)}</strong><div class="small">Borrower: ${escapeHtml(l.borrowerName)} • ₹${l.principal} • ${l.rate}% • ${paid}/${l.termMonths} paid</div></div>
      <div class="actions"><button class="btn" onclick="openLoanModal(${l.id})">View</button></div>`;
    container.appendChild(el);
  });
}
async function renderAdminUsers(){
  const users = DB.get('users') || []; const container = $('#adminUsers'); container.innerHTML='';
  if(!users.length) container.innerHTML = '<div class="small">No users</div>';
  users.forEach(u=>{
    const el = document.createElement('div'); el.className='item';
    el.innerHTML = `<div><strong>${escapeHtml(u.name)}</strong><div class="small">${escapeHtml(u.email)} • role: ${u.role||'n/a'} • credit: ${u.credit||'—'}</div></div>
      <div class="actions"><button class="btn" onclick="openUserModal('${u.email}')">Profile</button></div>`;
    container.appendChild(el);
  });
}

/* =========================
   HR: manage users
========================= */
async function renderHRUsers(){
  const users = DB.get('users') || []; const container = $('#hrUsers'); container.innerHTML='';
  if(!users.length) container.innerHTML = '<div class="small">No users</div>';
  users.forEach((u, idx) => {
    const el = document.createElement('div'); el.className='item';
    el.innerHTML = `<div><strong>${escapeHtml(u.name)}</strong><div class="small">${escapeHtml(u.email)} • role: ${u.role||'—'} • credit: ${u.credit||'—'}</div></div>
      <div class="actions">
        <button class="btn" onclick="setUserRole(${idx})">Set Role</button>
        <button class="btn danger" onclick="deleteUser(${idx})">Delete</button>
      </div>`;
    container.appendChild(el);
  });
}
function setUserRole(i){
  const users = DB.get('users') || []; const role = prompt('Enter role (admin,lender,borrower,hr,analyst)', users[i].role || '');
  if(!role) return; users[i].role = role; DB.set('users', users); renderHRUsers(); renderAdminUsers();
}
function deleteUser(i){
  let users = DB.get('users') || []; users.splice(i,1); DB.set('users', users); renderHRUsers(); renderAdminUsers();
}

/* =========================
   Analyst: simple chart & CSV export
========================= */
function drawAnalyst(){
  const canvas = document.getElementById('analystCanvas'); const ctx = canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height);
  const loans = DB.get('loans') || []; const total = loans.reduce((s,l)=> s + (l.principal||0),0); const count = loans.length;
  ctx.fillStyle = '#0b76ff'; ctx.fillRect(40,160, Math.min(600, total/1000), 24);
  ctx.fillStyle = '#111'; ctx.font='16px Inter'; ctx.fillText('Total Principal: ₹' + total, 40, 40);
  ctx.fillText('Loan Count: ' + count, 40, 66);
}
function exportCSV(type){
  if(type==='loans'){
    const loans = DB.get('loans')||[]; let csv = 'id,title,principal,rate,term,emi,borrowerEmail\\n';
    loans.forEach(l=> csv += `${l.id},"${(l.title||'').replace(/"/g,'""')}",${l.principal},${l.rate},${l.termMonths||''},${l.emi||''},"${(l.borrowerEmail||'')}"\\n`);
    download(csv, 'loans_export.csv', 'text/csv');
  } else {
    const txs = DB.get('transactions')||[]; let csv = 'id,loanId,amount,month,at,by\\n';
    txs.forEach(t=> csv += `${t.id},${t.loanId},${t.amount},${t.month},${t.at},${t.by}\\n`);
    download(csv, 'payments_export.csv', 'text/csv');
  }
}
function download(data, filename, type){
  const blob = new Blob([data], { type }); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

/* =========================
   Modals & small UX
========================= */
function showModal(show){
  const m = document.getElementById('modalBackdrop');
  m.classList.toggle('show', !!show);
  m.setAttribute('aria-hidden', !show);
}
$('#closeModal')?.addEventListener('click', ()=> showModal(false));

async function openLoanModal(id){
  const loan = (DB.get('loans')||[]).find(l=> l.id == id);
  if(!loan) return toast('Loan not found');
  $('#modalTitle').textContent = 'Loan Details';
  const body = $('#modalBody'); body.innerHTML = `<div><strong>${escapeHtml(loan.title)}</strong><div class="small">Borrower: ${escapeHtml(loan.borrowerName)} • ₹${loan.principal} • ${loan.rate}%</div></div>
    <div style="margin-top:10px"><strong>Schedule</strong><div class="small">${loan.schedule.map(s=> `Month ${s.month}: ₹${s.payment} (paid: ${s.paid ? 'yes' : 'no'})`).join('<br>')}</div></div>`;
  showModal(true);
}
function openUserModal(email){
  const users = DB.get('users')||[]; const u = users.find(x=> x.email === email);
  if(!u) return toast('User not found');
  $('#modalTitle').textContent = 'User Profile';
  $('#modalBody').innerHTML = `<div><strong>${escapeHtml(u.name)}</strong><div class="small">${escapeHtml(u.email)} • role: ${u.role||'—'}</div></div>
    <div style="margin-top:10px" class="small">Credit: ${u.credit || '—'}</div>`;
  showModal(true);
}

/* =========================
   Utilities & boot
========================= */
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m] }); }

window.onload = async ()=>{
  // bind small global things
  $all('.nav-btn').forEach(b=> b.addEventListener('click', ()=> { /* handled by switchPanel */ }));
  // search input
  $('#globalSearch').addEventListener('input', (e)=> { /* optional: live filter, not heavy here */ });

  // analyst exports
  $('#exportLoans')?.addEventListener('click', ()=> exportCSV('loans'));
  $('#exportPayments')?.addEventListener('click', ()=> exportCSV('payments'));

  // initial render
  await refreshAll();
};

/* convenience functions that call multiple renders */
async function refreshAll(){
  await refreshMetrics();
  await renderRecentLoans();
  await renderDashPending();
  await renderOffers();
  await renderMarket();
  await renderBorrowMarket();
  await renderMyLoans();
  await renderPendingQueue();
  await renderAdminLoans();
  await renderAdminUsers();
  await renderHRUsers();
  renderPlans();
  drawAnalyst();
}

/* small helpers exposed for inline onclick */
window.publishOffer = publishOffer;
window.applyFromMarket = applyFromMarket;
window.simulatePay = simulatePay;
window.setUserRole = setUserRole;
window.deleteUser = deleteUser;
window.reviewDoc = reviewDoc;
window.applyPlan = applyPlan;
window.openLoanModal = openLoanModal;
window.openUserModal = openUserModal;
window.previewDoc = previewDoc;
window.downloadDoc = downloadDoc;
window.exportCSV = exportCSV;

/* helper: open loan apply modal (preview) - not used but ready */
function openApplyModal(){ /* placeholder */ }

/* Small clean up: ensure UI reflects changes when file edited externally */
window.addEventListener('storage', (e)=> { /* local storage changed in another tab */ refreshAll(); });

/* End of script */
</script>

</body>
</html>
