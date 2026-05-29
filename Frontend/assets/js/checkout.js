
const API_BASE = 'http://localhost:8080';

//DOM References 
const checkoutItems = document.getElementById('checkout-items');
const checkoutTotal = document.getElementById('checkout-total');
const placeOrderBtn = document.getElementById('place-order-btn');
const checkoutError = document.getElementById('checkout-error');
const cartBadge = document.getElementById('cart-badge');
const userGreeting = document.getElementById('user-greeting');

//Initialization
document.addEventListener('DOMContentLoaded', function() {
  const user = getStoredUser();

  // Require authentication
  if (!user) {
    window.location.href = 'login.html?redirect=checkout.html';
    return;
  }

  // Require items in cart
  const cart = getCart();
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  updateAuthUI();
  updateCartBadge();
  renderOrderSummary();
  prefillAddress();
  bindEvents();
});

// Auth UI 
function updateAuthUI() {
  const user = getStoredUser();
  if (user) {
    userGreeting.innerHTML = 'Hi, <strong>' + escapeHtml(user.username) + '</strong>';
  }
}

//Pre-fill Address using user details
function prefillAddress() {
  const user = getStoredUser();
  if (user) {
    document.getElementById('ship-name').value = user.username || '';
    document.getElementById('ship-address').value = user.address || '';
  }
}

//Render Order Summary 
function renderOrderSummary() {
  const cart = getCart();
  let html = '';
  let total = 0;

  cart.forEach(item => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;
    html += `
      <div class="summary-row">
        <span>${escapeHtml(item.name)} &times;${item.quantity}</span>
        <span>${formatPrice(lineTotal)}</span>
      </div>
    `;
  });

  checkoutItems.innerHTML = html;
  checkoutTotal.textContent = formatPrice(total);
}

// Event Binding
function bindEvents() {
  placeOrderBtn.addEventListener('click', handlePlaceOrder);

  // Restrict phone input to digits only, max 10
  const phoneInput = document.getElementById('ship-phone');
  phoneInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
  });
}

//Place Order 
async function handlePlaceOrder() {
  const user = getStoredUser();
  const cart = getCart();

  // Validate form
  const name = document.getElementById('ship-name').value.trim();
  const address = document.getElementById('ship-address').value.trim();
  const phone = document.getElementById('ship-phone').value.trim();

  if (!name || !address || !phone) {
    showError('Please fill in all shipping details.');
    return;
  }

  // Phone number validation - 10 difits
  if (!/^\d{10}$/.test(phone)) {
    showError('Phone number must be exactly 10 digits.');
    return;
  }

  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

  // Disable button during processing
  placeOrderBtn.disabled = true;
  placeOrderBtn.textContent = 'Processing...';
  checkoutError.classList.remove('visible');

  try {
    // Verify we have a valid userId before proceeding
    if (!user.userId) {
      throw new Error('Session expired. Please sign out and sign in again.');
    }

    // Calculate total
    const totalCost = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Build order payload matching Spring Boot SweetOrder entity expectations
    const orderPayload = {
      customer: { userId: user.userId },
      status: 'PENDING',
      totalCost: totalCost
    };

    // Place order via API
    const res = await fetch(API_BASE + '/sweet_order/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(user.username + ':' + user.password)
      },
      body: JSON.stringify(orderPayload)
    });

    // Handle response — backend may return JSON or plain text
    let responseData;
    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      responseData = await res.json();
    } else {
      const textBody = await res.text();
      responseData = { message: textBody };
    }

    if (!res.ok) {
      throw new Error(responseData.message || 'Failed to place order. Please try again.');
    }

    // Clear cart after successful order
    localStorage.removeItem('sm_cart');

    showToast('Order placed successfully!', 'success');

    // Redirect to orders page
    setTimeout(() => {
      window.location.href = 'orders.html';
    }, 1000);

  } catch (err) {
    showError(err.message || 'Something went wrong. Please try again.');
    placeOrderBtn.disabled = false;
    placeOrderBtn.textContent = 'Place Order';
  }
}

//Utilities 
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('sm_cart')) || [];
  } catch {
    return [];
  }
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('sm_user'));
  } catch {
    return null;
  }
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  cartBadge.textContent = count > 0 ? count : '';
  cartBadge.style.display = count > 0 ? 'inline-flex' : 'none';
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

function showError(message) {
  checkoutError.textContent = message;
  checkoutError.classList.add('visible');
}

function showToast(message, type) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast ' + (type || '');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
