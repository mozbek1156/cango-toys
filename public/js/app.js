// ============== CANGO TOYS – app.js ==============

// --- Cart ---
function getCart() {
  return JSON.parse(localStorage.getItem('cangoCart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('cangoCart', JSON.stringify(cart));
  updateCartBadge();
}
function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => el.textContent = total);
}
function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: product.id, name: product.name, price_retail: product.price_retail, price_wholesale: product.price_wholesale, qty, emoji: getCategoryEmoji(product.categoryInfo) });
  }
  saveCart(cart);
  showToast(`"${product.name}" sepete eklendi! 🛒`);
}
function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}
function clearCart() {
  localStorage.removeItem('cangoCart');
  updateCartBadge();
}

// Cart type (retail/wholesale)
function getCartType() {
  return localStorage.getItem('cangoCartType') || 'retail';
}
function setCartType(type) {
  localStorage.setItem('cangoCartType', type);
}

// --- Product Card Renderer ---
const CATEGORY_EMOJIS = {
  'cat1': '🚀', 'cat2': '✏️', 'cat3': '🎲', 'cat4': '🦸',
  'cat5': '🧸', 'cat6': '🧩', 'cat7': '⛳', 'cat8': '🎨'
};
function getCategoryEmoji(catInfo) {
  if (!catInfo) return '🎁';
  const emojis = { 'oyuncaklar':'🚀','kirtasiye':'✏️','kutu-oyunlari':'🎲','figur-setler':'🦸','peluslar':'🧸','egitici-oyuncaklar':'🧩','acik-hava':'⛳','sanat-hobi':'🎨' };
  return emojis[catInfo.slug] || '🎁';
}
function getStockBadge(stock) {
  if (stock === 0) return '<span class="stock-badge stock-out">⚠️ Stok Yok</span>';
  if (stock < 5) return `<span class="stock-badge stock-low">⚡ Son ${stock} adet</span>`;
  return `<span class="stock-badge stock-ok">✅ Stokta</span>`;
}
function renderProductCard(p) {
  const emoji = getCategoryEmoji(p.categoryInfo);
  const catName = p.categoryInfo ? p.categoryInfo.name : '';
  const wholesale = p.price_wholesale ? `<div class="price-wholesale-label">Toptan:</div><div class="price-wholesale">₺${p.price_wholesale.toFixed(2)}</div>` : '';
  return `
    <div class="product-card" onclick="window.location='/product.html?id=${p.id}'" style="cursor:pointer">
      <div class="product-card-img">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover"/>` : emoji}
        ${p.featured ? '<span class="product-badge-featured">⭐ Öne Çıkan</span>' : ''}
        <span class="product-badge-wholesale">TOPTAN ₺${p.price_wholesale ? p.price_wholesale.toFixed(0) : ''}</span>
      </div>
      <div class="product-card-body">
        <span class="product-cat-tag">${catName}</span>
        <div class="product-name">${p.name}</div>
        <div class="product-prices">
          <div class="price-retail">₺${p.price_retail.toFixed(2)}</div>
          ${wholesale}
        </div>
        <div class="product-card-footer" style="display:flex;justify-content:space-between;align-items:center">
          ${getStockBadge(p.stock)}
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();quickAdd(${JSON.stringify(p).replace(/"/g,'&quot;')})" ${p.stock===0?'disabled':''}>
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>`;
}

function quickAdd(product) {
  addToCart(product, 1);
}

// --- Toast ---
function showToast(msg, type = 'success') {
  const icons = { success: '✅', error: '❌', warning: '⚠️' };
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// --- Format currency ---
function formatCurrency(n) {
  return '₺' + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
