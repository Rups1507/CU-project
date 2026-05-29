
const API_BASE = 'http://localhost:8080';

//State
let allProducts = [];
let allCategories = [];
let activeCategory = 'all';
let searchQuery = '';

//DOM References
const productGrid = document.getElementById('product-grid');
const categoryFilters = document.getElementById('category-filters');
const searchInput = document.getElementById('search-input');
const cartBadge = document.getElementById('cart-badge');
const userGreeting = document.getElementById('user-greeting');
const authBtn = document.getElementById('auth-btn');

//Initialization
document.addEventListener('DOMContentLoaded', init);

async function init() {
  updateAuthUI();
  updateCartBadge();
  await loadCategories();
  await loadProducts();
  renderCategoryFilters();
  renderProducts();
  bindEvents();
}

//Auth UI
function updateAuthUI() {
  const user = getStoredUser();
  if (user) {
    userGreeting.innerHTML = 'Hi, <strong>' + escapeHtml(user.username) + '</strong>';
    authBtn.textContent = 'Sign Out';
    authBtn.href = '#';
    authBtn.addEventListener('click', handleLogout);

    // Show admin link if user is admin
    if (user.role === 'ROLE_ADMIN') {
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) {
        const adminLink = document.createElement('a');
        adminLink.href = 'pages/admin.html';
        adminLink.textContent = 'Admin Panel';
        adminLink.className = '';
        navLinks.appendChild(adminLink);
      }
    }
  } else {
    userGreeting.textContent = '';
    authBtn.textContent = 'Sign In';
    authBtn.href = 'pages/login.html';
  }
}

function handleLogout(e) {
  e.preventDefault();
  localStorage.removeItem('sm_user');
  localStorage.removeItem('sm_cart');
  window.location.reload();
}

//Data Loading
async function loadProducts() {
  try {
    const res = await fetch(API_BASE + '/product/all');
    if (!res.ok) throw new Error('Failed to load products');
    allProducts = await res.json();
  } catch (err) {
    console.warn('Could not load products from backend:', err.message);
    allProducts = [];
  }
}

async function loadCategories() {
  try {
    const res = await fetch(API_BASE + '/category/all');
    if (!res.ok) throw new Error('Failed to load categories');
    allCategories = await res.json();
  } catch (err) {
    console.warn('Could not load categories:', err.message);
    allCategories = [];
  }
}

//Rendering
function renderCategoryFilters() {
  let html = '<button class="category-btn active" data-cat="all">All</button>';
  allCategories.forEach(cat => {
    html += '<button class="category-btn" data-cat="' + cat.categoryId + '">' + escapeHtml(cat.name) + '</button>';
  });
  categoryFilters.innerHTML = html;
}

function renderProducts() {
  let filtered = allProducts;

  // Filter by category
  if (activeCategory !== 'all') {
    filtered = filtered.filter(p => p.category && p.category.categoryId === parseInt(activeCategory));
  }

  // Filter by search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    productGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">&#128270;</div>
        <h3>No sweets found</h3>
        <p>Try adjusting your search or category filter.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = filtered.map(product => buildProductCard(product)).join('');
}

function buildProductCard(product) {
  const catName = product.category ? product.category.name : '';
  const isAvailable = product.available !== false;
  const priceFormatted = formatPrice(product.price);
  const descShort = (product.description || '').substring(0, 80);

  // Use photoPath if it looks like a URL, otherwise show a placeholder
  let imageContent;
  if (product.photoPath && (product.photoPath.startsWith('http') || product.photoPath.startsWith('/'))) {
    imageContent = '<img src="' + escapeHtml(product.photoPath) + '" alt="' + escapeHtml(product.name) + '">';
  } else {
    imageContent = '&#127852;';
  }

  // Check if this product is already in the cart to show counter
  const cart = getCart();
  const cartItem = cart.find(item => item.productId === product.productId);
  let cartActionHtml;

  if (!isAvailable) {
    cartActionHtml = '<span class="product-unavailable">Sold Out</span>';
  } else if (cartItem && cartItem.quantity > 0) {
    // Show inline counter
    cartActionHtml = `
      <div class="inline-cart-counter" data-product-id="${product.productId}">
        <button class="counter-btn counter-minus" onclick="decrementFromCard(${product.productId})">&#8722;</button>
        <span class="counter-value">${cartItem.quantity}</span>
        <button class="counter-btn counter-plus" onclick="incrementFromCard(${product.productId})">&#43;</button>
      </div>
    `;
  } else {
    // Show Add to Cart button
    cartActionHtml = '<button class="btn-add-cart" onclick="addToCart(' + product.productId + ')">Add to Cart</button>';
  }

  return `
    <article class="product-card">
      <div class="product-card-image">${imageContent}</div>
      <div class="product-card-body">
        <div class="product-card-category">${escapeHtml(catName)}</div>
        <h3 class="product-card-name">${escapeHtml(product.name)}</h3>
        <p class="product-card-desc">${escapeHtml(descShort)}</p>
        <div class="product-card-footer">
          <div class="product-price">${priceFormatted} <small>/pc</small></div>
          ${cartActionHtml}
        </div>
      </div>
    </article>
  `;
}

//Cart Logic (localStorage)
function addToCart(productId) {
  const product = allProducts.find(p => p.productId === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.productId === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      productId: product.productId,
      name: product.name,
      price: product.price,
      photoPath: product.photoPath || '',
      category: product.category ? product.category.name : '',
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartBadge();
  renderProducts(); // Re-render to show counter
  showToast(product.name + ' added to cart', 'success');
}

function incrementFromCard(productId) {
  const cart = getCart();
  const item = cart.find(i => i.productId === productId);
  if (item) {
    item.quantity += 1;
    saveCart(cart);
    updateCartBadge();
    renderProducts();
  }
}

function decrementFromCard(productId) {
  const cart = getCart();
  const itemIndex = cart.findIndex(i => i.productId === productId);
  if (itemIndex === -1) return;

  cart[itemIndex].quantity -= 1;

  // If quantity reaches 0, remove from cart entirely
  if (cart[itemIndex].quantity <= 0) {
    cart.splice(itemIndex, 1);
  }

  saveCart(cart);
  updateCartBadge();
  renderProducts(); // Re-render to switch back to "Add to Cart" button
}

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

// Event Binding
function bindEvents() {
  // Category filter clicks
  categoryFilters.addEventListener('click', function(e) {
    if (e.target.classList.contains('category-btn')) {
      categoryFilters.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      activeCategory = e.target.dataset.cat;
      renderProducts();
    }
  });

  // Search input
  searchInput.addEventListener('input', function() {
    searchQuery = this.value;
    renderProducts();
  });
}

// Utilities 
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
window.addToCart = addToCart;
window.incrementFromCard = incrementFromCard;
window.decrementFromCard = decrementFromCard;
