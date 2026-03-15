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
function addToCart(product, qty = 1, btnElement = null) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: product.id, name: product.name, price_retail: product.price_retail, price_wholesale: product.price_wholesale, qty, emoji: getCategoryEmoji(product.categoryInfo) });
  }
  saveCart(cart);
  showToast(`"${product.name}" sepete eklendi! 🛒`);
  
  if (btnElement) {
    btnElement.classList.add('bounce-anim');
    setTimeout(() => btnElement.classList.remove('bounce-anim'), 400);
  }
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
  const ageTag = p.ageGroup ? `<span style="position:absolute; top:12px; left:12px; background:var(--brand-peach); color:white; font-size:0.75rem; font-weight:800; padding:0.25rem 0.6rem; border-radius:50px; z-index:2;">👶 ${p.ageGroup} Yaş</span>` : '';
  const stockWarning = (p.stock > 0 && p.stock < 5) ? `<div style="color:#EA580C;font-size:0.78rem;font-weight:800;margin-top:0.3rem;">🔥 Son ${p.stock} ürün!</div>` : '';
  
  return `
    <div class="product-card" style="cursor:pointer; position:relative;">
      <div class="product-card-img">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover"/>` : emoji}
        ${p.featured ? '<span class="product-badge-featured" style="z-index:2;">⭐ Öne Çıkan</span>' : ''}
        ${ageTag}
      </div>
      <!-- HOVER OVERLAY -->
      <div class="product-card-overlay">
        <button class="overlay-btn" onclick="event.stopPropagation();quickAdd(${JSON.stringify(p).replace(/"/g,'&quot;')}, this)" ${p.stock===0?'disabled':''}>🛒 Sepete Ekle</button>
        <button class="overlay-btn overlay-btn-quick" onclick="window.location='/product.html?id=${p.id}'">👁️ Hızlı İncele</button>
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
          <button class="btn btn-primary btn-sm btn-add" onclick="event.stopPropagation();quickAdd(${JSON.stringify(p).replace(/"/g,'&quot;')}, this)" ${p.stock===0?'disabled':''}>
            Sepete Ekle
          </button>
        </div>
        ${stockWarning}
      </div>
    </div>`;
}

function quickAdd(product, btn) {
  addToCart(product, 1, btn);
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
