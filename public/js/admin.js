// ===== ADMIN JS =====
const API = '';
function getToken() { return localStorage.getItem('adminToken'); }
function setToken(t) { localStorage.setItem('adminToken', t); }

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() };
}

async function checkAuth() {
  const token = getToken();
  if (!token) { window.location = '/admin/login.html'; return false; }
  const res = await fetch('/api/auth/verify', { headers: { Authorization: 'Bearer ' + token } });
  if (!res.ok) { window.location = '/admin/login.html'; return false; }
  return true;
}

function logout() {
  localStorage.removeItem('adminToken');
  window.location = '/admin/login.html';
}

function showToast(msg, type = 'success') {
  const icons = { success: '✅', error: '❌', warning: '⚠️' };
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast ${type !== 'success' ? type : ''}`;
  t.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

function statusBadgeHtml(status) {
  const map = { pending:'badge-brand-green⏳ Bekliyor', processing:'badge-blue🔄 İşleniyor', completed:'badge-green✅ Tamamlandı', cancelled:'badge-brand-purple❌ İptal' };
  const val = map[status] || 'badge-gray' + status;
  const [cls, ...rest] = val.split(/(?<=^[a-z-]+)/);
  return `<span class="badge ${cls}">${rest.join('')}</span>`;
}

function typeBadge(type) {
  return type === 'wholesale'
    ? '<span class="badge badge-blue">📦 Toptan</span>'
    : '<span class="badge badge-gray">🛍️ Perakende</span>';
}

// Sidebar toggle for mobile
function toggleSidebar() {
  document.querySelector('.admin-sidebar')?.classList.toggle('open');
}
