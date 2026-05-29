

// DOM References 
const cartItemsEl = document.getElementById('cart-items');
const cartSummary = document.getElementById('cart-summary');
const summaryRows = document.getElementById('summary-rows');
const cartTotal = document.getElementById('cart-total');
const emptyCart = document.getElementById('empty-cart');
const cartActions = document.getElementById('cart-actions');
const cartCountText = document.getElementById('cart-count-text');
const cartBadge = document.getElementById('cart-badge');
const userGreeting = document.getElementById('user-greeting');
const authBtn = document.getElementById('auth-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');

//Initialization 
document.addEventListener('DOMContentLoaded', function() {
  updateAuthUI();
  renderCart();
  bindEvents();
});

// Auth UI 
function updateAuthUI() {
  const user = getStoredUser();
  if (user) {
    userGreeting.innerHTML = 'Hi, <strong>' + escapeHtml(user.username) + '</strong>';
    authBtn.textContent = 'Sign Out';
    authBtn.href = '#';
    authBtn.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('sm_user');
      localStorage.removeItem('sm_cart');
      window.location.href = '../index.html';
    });
  }
}

//Render Cart 
function renderCart() {
  const cart = getCart();

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '';
    cartSummary.style.display = 'none';
    cartActions.style.display = 'none';
    emptyCart.style.display = 'block';
    cartCountText.textContent = '0 items in your cart';
    updateCartBadge();
    return;
  }

  emptyCart.style.display = 'none';
  cartSummary.style.display = 'block';
  cartActions.style.display = 'block';

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountText.textContent = totalItems + ' item' + (totalItems !== 1 ? 's' : '') + ' in your cart';

  // Render cart items
  cartItemsEl.innerHTML = cart.map(item => buildCartItem(item)).join('');

  // Render summary
  let summaryHtml = '';
  cart.forEach(item => {
    const lineTotal = item.price * item.quantity;
    summaryHtml += `
      <div class="summary-row">
        <span>${escapeHtml(item.name)} &times;${item.quantity}</span>
        <span>${formatPrice(lineTotal)}</span>
      </div>
    `;
  });
  summaryRows.innerHTML = summaryHtml;

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = formatPrice(total);

  updateCartBadge();
}

function buildCartItem(item) {
  const lineTotal = item.price * item.quantity;

  // use photoPath stored in cart item
  let thumbContent;
  if (item.photoPath && (item.photoPath.startsWith('http') || item.photoPath.startsWith('/'))) {
    thumbContent = '<img src="' + escapeHtml(item.photoPath) + '" alt="' + escapeHtml(item.name) + '">';
  } else {
    thumbContent = '&#127852;';
  }

  return `
    <div class="cart-item" data-id="${item.productId}">
      <div class="cart-item-thumb">${thumbContent}</div>
      <div class="cart-item-info">
        <h4>${escapeHtml(item.name)}</h4>
        <span class="item-category">${escapeHtml(item.category || '')}</span>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQuantity(${item.productId}, -1)" aria-label="Decrease quantity">&minus;</button>
        <span class="qty-value">${item.quantity}</span>
        <button class="qty-btn" onclick="changeQuantity(${item.productId}, 1)" aria-label="Increase quantity">&plus;</button>
      </div>
      <div class="cart-item-price">${formatPrice(lineTotal)}</div>
      <button class="cart-item-remove" onclick="removeItem(${item.productId})" aria-label="Remove item" title="Remove from cart">&times;</button>
    </div>
  `;
}

//Cart Operations 
function changeQuantity(productId, delta) {
  const cart = getCart();
  const itemIndex = cart.findIndex(i => i.productId === productId);
  if (itemIndex === -1) return;

  cart[itemIndex].quantity += delta;

  // If quantity drops to 0 or below, remove the item entirely
  if (cart[itemIndex].quantity <= 0) {
    cart.splice(itemIndex, 1);
    showToast('Item removed from cart', '');
  }

  saveCart(cart);
  renderCart();
}

function removeItem(productId) {
  const cart = getCart().filter(i => i.productId !== productId);
  saveCart(cart);
  renderCart();
  showToast('Item removed from cart', '');
}

function clearAllCart() {
  saveCart([]);
  renderCart();
  showToast('Cart cleared', '');
}

// Event Binding 
function bindEvents() {
  clearCartBtn.addEventListener('click', clearAllCart);
}

// Utilities 
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('sm_cart')) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('sm_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  cartBadge.textContent = count > 0 ? count : '';
  cartBadge.style.display = count > 0 ? 'inline-flex' : 'none';
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('sm_user'));
  } catch {
    return null;
  }
}

function formatPrice(amount) {
  return '\u20B9' + Number(amount || 0).toLocaleString('en-IN');
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(message, type) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast ' + (type || '');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

//inline onclick handlers
window.changeQuantity = changeQuantity;
window.removeItem = removeItem;
