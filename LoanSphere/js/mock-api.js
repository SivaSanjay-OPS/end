// ==========================================
// mock-api.js — Simulated Async API Layer
// (Uses localStorage, no backend required)
// ==========================================

window.MockAPI = {

  // List all items in a table
  async list(key) {
    return new Promise(res =>
      setTimeout(() => res(LS.get(key) || []), 120)
    );
  },

  // Get specific item by id
  async get(key, id) {
    const list = LS.get(key) || [];
    return list.find(x => x.id == id) || null;
  },

  // Create a new record
  async create(key, obj) {
    const list = LS.get(key) || [];
    list.push(obj);
    LS.set(key, list);
    return obj;
  },

  // Update an existing record
  async update(key, id, patch) {
    const list = LS.get(key) || [];
    const i = list.findIndex(x => x.id == id);

    if (i === -1) return null;

    list[i] = { ...list[i], ...patch };
    LS.set(key, list);

    return list[i];
  },

  // Delete record
  async remove(key, id) {
    const list = LS.get(key) || [];
    const i = list.findIndex(x => x.id == id);

    if (i === -1) return false;

    list.splice(i, 1);
    LS.set(key, list);

    return true;
  }
};
