// borrower.js — apply for offers, upload docs, view loan schedule, simulate payments

document.getElementById('homeBtn').addEventListener('click', () => {
  location.href = '../index.html';
});

// Render marketplace (published offers)
function renderMarket() {
  const market = LS.get('market') || [];
  const container = document.getElementById('market');
  container.innerHTML = '';

  if (!market.length) {
    container.innerHTML = '<p>No offers in marketplace.</p>';
    return;
  }

  market.forEach(o => {
    const item = document.createElement('div');
    item.className = 'item fade-in';
    item.innerHTML = `
      <strong>${o.title}</strong>
      <div><small>₹${o.principal} @ ${o.rate}% for ${o.term} months</small></div>
      <div style="margin-top:8px;">
        <button class="apply-btn" data-id="${o.id}">Apply</button>
      </div>
    `;
    container.appendChild(item);
  });

  document.querySelectorAll('.apply-btn').forEach(b => {
    b.addEventListener('click', e => applyOffer(e.target.dataset.id));
  });
}

// Apply to an offer — creates a loan instance with amortized schedule
async function applyOffer(id) {
  const market = LS.get('market') || [];
  const offer = market.find(x => x.id == id);
  if (!offer) return alert('Offer not found.');

  const name = prompt('Enter your full name for the application:');
  const email = prompt('Enter your email:');
  if (!name || !email) return alert('Name and email are required.');

  // EMI calculation (amortized monthly)
  const monthlyRate = offer.rate / 100 / 12;
  const n = Number(offer.term);
  const P = Number(offer.principal);

  // handle zero-rate gracefully
  let emi;
  if (monthlyRate === 0) {
    emi = P / n;
  } else {
    emi = (P * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
  }
  emi = Math.round(emi * 100) / 100;

  const schedule = [];
  let balance = P;
  for (let i = 1; i <= n; i++) {
    const interest = Math.round(balance * monthlyRate * 100) / 100;
    const principal = Math.round((emi - interest) * 100) / 100;
    balance = Math.round(Math.max(0, balance - principal) * 100) / 100;
    schedule.push({
      month: i,
      payment: emi,
      principal,
      interest,
      balance,
      paid: false
    });
  }

  const loan = {
    id: Date.now(),
    title: offer.title,
    principal: P,
    rate: offer.rate,
    termMonths: n,
    emi,
    borrowerName: name,
    borrowerEmail: email,
    schedule,
    createdAt: Date.now(),
    status: 'applied'
  };

  await MockAPI.create('loans', loan);

  // ensure user record exists
  const users = LS.get('users') || [];
  if (!users.find(u => u.email === email)) {
    users.push({ name, email, role: 'borrower' });
    LS.set('users', users);
  }

  alert('Application submitted. Upload documents next so Admin can review.');
  renderMyLoans();
}

// Render borrower's loans (those with borrowerEmail)
function renderMyLoans() {
  const loans = (LS.get('loans') || []).filter(l => l.borrowerEmail);
  const container = document.getElementById('myLoans');
  container.innerHTML = '';

  if (!loans.length) {
    container.innerHTML = '<p>No loans yet.</p>';
    return;
  }

  loans.forEach(loan => {
    const d = document.createElement('div');
    d.className = 'loan fade-in';

    d.innerHTML = `
      <strong>${loan.title}</strong>
      <div><small>EMI: ₹${loan.emi} | Status: ${loan.status || '—'}</small></div>
      <div style="margin-top:8px;">
        <button class="pay-btn" data-id="${loan.id}">Make Payment (simulate)</button>
      </div>
      <details style="margin-top:8px;">
        <summary>Repayment Schedule</summary>
        <div class="schedule-row">
          ${loan.schedule.map(s => `<div>Month ${s.month}: ₹${s.payment} (paid: ${s.paid ? 'yes' : 'no'})</div>`).join('')}
        </div>
      </details>
    `;
    container.appendChild(d);
  });

  document.querySelectorAll('.pay-btn').forEach(b => {
    b.addEventListener('click', e => makePayment(e.target.dataset.id));
  });
}

// Simulate a borrower making the next unpaid EMI
async function makePayment(loanId) {
  const loan = await MockAPI.get('loans', Number(loanId));
  if (!loan) return alert('Loan not found.');

  const next = loan.schedule.find(s => !s.paid);
  if (!next) return alert('All payments completed.');

  next.paid = true;
  next.paidAt = Date.now();

  await MockAPI.update('loans', loan.id, loan);
  alert(`Payment recorded for month ${next.month}.`);
  renderMyLoans();
}

// DOCUMENT UPLOAD — converts file to Base64 and stores in pendingDocs
document.getElementById('upload').addEventListener('click', () => {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const file = document.getElementById('fileInput').files[0];

  if (!name || !email) return alert('Please enter name and email before uploading.');
  if (!file) return alert('Please choose a file to upload.');

  const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
  if (!allowed.includes(file.type)) return alert('Only PDF, PNG or JPEG files are allowed.');

  // Optional: limit file size (demo: 4 MB)
  const maxSize = 4 * 1024 * 1024;
  if (file.size > maxSize) return alert('File too large. Maximum 4 MB allowed.');

  const reader = new FileReader();
  reader.onload = () => {
    const data = reader.result; // base64
    const pending = LS.get('pendingDocs') || [];
    pending.push({
      id: Date.now(),
      name: file.name,
      type: file.type,
      data,
      borrower: name,
      borrowerEmail: email,
      date: Date.now()
    });
    LS.set('pendingDocs', pending);

    // ensure user exists
    const users = LS.get('users') || [];
    if (!users.find(u => u.email === email)) {
      users.push({ name, email, role: 'borrower' });
      LS.set('users', users);
    }

    alert('File uploaded and queued for admin review.');
  };
  reader.readAsDataURL(file);
});

// Initial render
renderMarket();
renderMyLoans();
