// hr.js — Manage user roles and account cleanup

document.getElementById('homeBtn').addEventListener('click', () => {
  location.href = '../index.html';
});

// Render all users
function renderUsers() {
  const users = LS.get('users') || [];
  const container = document.getElementById('users');
  container.innerHTML = '';

  if (!users.length) {
    container.innerHTML = '<p>No users found.</p>';
    return;
  }

  users.forEach((u, index) => {
    const item = document.createElement('div');
    item.className = 'user-item fade-in';

    item.innerHTML = `
      <strong>${u.name || 'Unnamed User'}</strong>
      <div><small>Email: ${u.email}</small></div>
      <div><small>Role: ${u.role || 'not assigned'}</small></div>

      <div style="margin-top:8px;">
        <button class="role-btn" data-i="${index}">Set Role</button>
        <button class="delete-btn" data-i="${index}">Delete</button>
      </div>
    `;

    container.appendChild(item);
  });

  // Add button handlers
  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const i = e.target.dataset.i;
      setRole(i);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const i = e.target.dataset.i;
      deleteUser(i);
    });
  });
}

// Assign role to a user
function setRole(i) {
  const users = LS.get('users') || [];
  const newRole = prompt(
    "Enter role (admin / lender / borrower / hr / analyst):",
    users[i].role || ""
  );

  if (!newRole) return;

  const valid = ["admin", "lender", "borrower", "hr", "analyst"];
  if (!valid.includes(newRole.toLowerCase())) {
    alert("Invalid role.");
    return;
  }

  users[i].role = newRole.toLowerCase();
  LS.set('users', users);
  renderUsers();
}

// Delete user
function deleteUser(i) {
  const users = LS.get('users') || [];
  users.splice(i, 1);
  LS.set('users', users);
  renderUsers();
}

// Initialize
renderUsers();
