// ================================
// common.js — Shared Utilities
// ================================

// LocalStorage helper wrapper
window.LS = {
  get(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch(e) { return null; }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  add(key, value) {
    const list = LS.get(key) || [];
    list.push(value);
    LS.set(key, list);
    return list;
  }
};

// Navigation from landing page
document.getElementById('openBtn')?.addEventListener('click', () => {
  const role = document.getElementById('role').value;
  if (!role) {
    alert("Please choose a role");
    return;
  }
  window.location.href = `./${role}/index.html`;
});
