// analyst.js — compute summaries, draw a simple chart, export CSVs

document.getElementById('homeBtn').addEventListener('click', () => location.href = '../index.html');

async function gatherData() {
  const loans = LS.get('loans') || [];
  const users = LS.get('users') || [];
  const pending = LS.get('pendingDocs') || [];
  return { loans, users, pending };
}

// Simple risk score: combination of document status and repayment punctuality
function computeCreditScore(userEmail, loans) {
  const userLoans = loans.filter(l => l.borrowerEmail === userEmail);
  if (!userLoans.length) return 400; // thin-file

  // score base 500 -> 300..850 scale-ish
  let score = 500;
  userLoans.forEach(l => {
    const totalMonths = l.schedule ? l.schedule.length : l.termMonths || 0;
    const paidCount = l.schedule ? l.schedule.filter(s => s.paid).length : 0;
    const payRatio = totalMonths ? (paidCount / totalMonths) : 0;

    // reward on-time payments
    score += Math.round(100 * payRatio);

    // penalize high interest and overdue
    if (l.rate > 18) score -= 40;
    if (payRatio < 0.5) score -= 60;
  });

  // clamp
  score = Math.max(300, Math.min(850, score));
  return score;
}

// Draw a simple bar-ish summary on canvas
function drawSummary(loans) {
  const canvas = document.getElementById('summaryChart');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const totalPrincipal = loans.reduce((s,l) => s + (Number(l.principal)||0), 0);
  const totalOutstanding = loans.reduce((s,l) => {
    if (!l.schedule) return s;
    return s + l.schedule.reduce((ss, item) => ss + (item.paid ? 0 : item.balance || 0), 0);
  }, 0);
  const loanCount = loans.length;

  // Simple visual blocks
  const startX = 40;
  const blockW = 120;
  const gap = 24;
  const baseY = 200;

  ctx.fillStyle = '#0b76ff';
  const h1 = Math.min(160, totalPrincipal / 1000);
  ctx.fillRect(startX, baseY - h1, blockW, h1);
  ctx.fillStyle = '#0066aa';
  ctx.fillRect(startX + blockW + gap, baseY - Math.min(160, totalOutstanding / 1000), blockW, Math.min(160, totalOutstanding / 1000));
  ctx.fillStyle = '#0a9a6e';
  ctx.fillRect(startX + 2*(blockW+gap), baseY - Math.min(160, loanCount * 15), blockW, Math.min(160, loanCount * 15));

  ctx.fillStyle = '#111';
  ctx.font = '14px Georgia';
  ctx.fillText('Total Principal: ₹' + totalPrincipal, startX + blockW + gap, 30);
  ctx.fillText('Total Outstanding: ₹' + totalOutstanding, startX + blockW + gap, 52);
  ctx.fillText('Number of Loans: ' + loanCount, startX + blockW + gap, 74);

  // small legend
  ctx.font = '12px Georgia';
  ctx.fillStyle = '#0b76ff'; ctx.fillRect(520, 150, 12, 12); ctx.fillStyle='#111'; ctx.fillText('Principal', 540, 162);
  ctx.fillStyle = '#0066aa'; ctx.fillRect(520, 170, 12, 12); ctx.fillStyle='#111'; ctx.fillText('Outstanding', 540, 182);
  ctx.fillStyle = '#0a9a6e'; ctx.fillRect(520, 190, 12, 12); ctx.fillStyle='#111'; ctx.fillText('Loan count', 540, 202);
}

// Render credit scores for each borrower (basic)
async function renderScores() {
  const { loans, users } = await gatherData();
  const borrowers = users.filter(u => (u.role === 'borrower' || (!u.role && u.email && loans.some(l=> l.borrowerEmail===u.email))));
  const container = document.getElementById('scoresArea');
  container.innerHTML = '';

  if (!borrowers.length) {
    container.innerHTML = '<p class="small-muted">No borrowers to score.</p>';
    return;
  }

  borrowers.forEach(b => {
    const score = computeCreditScore(b.email, loans);
    const card = document.createElement('div');
    card.className = 'score-card fade-in';
    card.innerHTML = `<strong>${b.name || b.email}</strong>
      <div class="score-meta">Email: ${b.email}</div>
      <div class="score-meta">Credit score (simulated): <strong>${score}</strong></div>
      <div class="score-meta">Document status: ${b.docStatus || 'unknown'}</div>`;
    container.appendChild(card);
  });
}

// Export helpers
async function exportLoansCsv() {
  const loans = LS.get('loans') || [];
  let csv = 'id,title,principal,rate,termMonths,emi,borrowerName,borrowerEmail,status\\n';
  loans.forEach(l => {
    csv += `${l.id},"${(l.title||'').replace(/"/g,'""')}",${l.principal},${l.rate},${l.termMonths||''},${l.emi||''},"${(l.borrowerName||'').replace(/"/g,'""')}","${(l.borrowerEmail||'').replace(/"/g,'""')}",${l.status||''}\\n`;
  });
  downloadBlob(csv, 'loans_export.csv', 'text/csv');
}

async function exportPaymentsCsv() {
  const loans = LS.get('loans') || [];
  let csv = 'loanId,borrowerEmail,month,payment,principal,interest,paid,paidAt\\n';
  loans.forEach(l => {
    (l.schedule||[]).forEach(s => {
      csv += `${l.id},${l.borrowerEmail||''},${s.month},${s.payment},${s.principal},${s.interest},${s.paid},${s.paidAt||''}\\n`;
    });
  });
  downloadBlob(csv, 'payments_export.csv', 'text/csv');
}

function downloadBlob(data, filename, type) {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function renderAll() {
  const { loans } = await gatherData();
  drawSummary(loans);
  document.getElementById('summaryText').innerText = `Loans: ${loans.length} • Total principal: ₹${loans.reduce((s,l)=> s + (Number(l.principal)||0),0)}`;
  await renderScores();
}

document.getElementById('exportCsv').addEventListener('click', exportLoansCsv);
document.getElementById('exportPayments').addEventListener('click', exportPaymentsCsv);

// initial draw
renderAll();
