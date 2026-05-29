const API_BASE = 'http://localhost:8080';

//DOM References
const ordersLoading = document.getElementById('orders-loading');
const ordersList = document.getElementById('orders-list');
const emptyOrders = document.getElementById('empty-orders');
const authRequired = document.getElementById('auth-required');
const cartBadge = document.getElementById('cart-badge');
const userGreeting = document.getElementById('user-greeting');
const authBtn = document.getElementById('auth-btn');

//Initialization 
document.addEventListener('DOMContentLoaded', function() {
  updateCartBadge();

  const user = getStoredUser();
  if (!user) {
    ordersLoading.style.display = 'none';
    authRequired.style.display = 'block';
    return;
  }

  updateAuthUI();
  loadOrders();
});

//Auth UI
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

//Load Orders
async function loadOrders() {
  const user = getStoredUser();

  try {
    let url = API_BASE + '/sweet_order/all';

    // If we have a userId, fetch only that customer's orders
    if (user.userId) {
      url = API_BASE + '/sweet_order/customer/' + user.userId;
    }

    const res = await fetch(url, {
      headers: {
        'Authorization': 'Basic ' + btoa(user.username + ':' + user.password)
      }
    });

    ordersLoading.style.display = 'none';

    if (!res.ok) {
      // no orders found
      if (res.status === 404) {
        emptyOrders.style.display = 'block';
        return;
      }
      throw new Error('Failed to load orders');
    }

    const orders = await res.json();

    if (!orders || orders.length === 0) {
      emptyOrders.style.display = 'block';
      return;
    }

    renderOrders(orders);

  } catch (err) {
    ordersLoading.style.display = 'none';
    emptyOrders.style.display = 'block';
    console.warn('Error loading orders:', err.message);
  }
}

//Render Orders
function renderOrders(orders) {
  // Sort by date descending (most recent first)
  orders.sort((a, b) => {
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);
    return dateB - dateA;
  });

  let html = '';

  orders.forEach(order => {
    const orderId = order.sweetOrderId || '—';
    const status = order.status || 'PENDING';
    const totalCost = order.totalCost || 0;
    const date = formatDate(order.date);

    html += `
      <div class="order-card">
        <div class="order-card-header">
          <div>
            <span class="order-id">Order #${orderId}</span>
            <span class="order-date">&nbsp;&mdash;&nbsp;${date}</span>
          </div>
          <span class="order-status status-${status}">${formatStatus(status)}</span>
        </div>
        <div class="order-card-body">
          <div class="order-total">Total: ${formatPrice(totalCost)}</div>
        </div>
      </div>
    `;
  });

  ordersList.innerHTML = html;
  ordersList.style.display = 'flex';
}

//Utilities
function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('sm_user'));
  } catch {
    return null;
  }
}

function updateCartBadge() {
  try {
    const cart = JSON.parse(localStorage.getItem('sm_cart')) || [];
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartBadge.textContent = count > 0 ? count : '';
    cartBadge.style.display = count > 0 ? 'inline-flex' : 'none';
  } catch {
    cartBadge.style.display = 'none';
  }
}

function formatPrice(amount) {
  return '\u20B9' + Number(amount || 0).toLocaleString('en-IN');
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

function formatStatus(status) {
  // Convert ENUM_STYLE to readable text
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).toLowerCase()
    .replace(/^\w/, c => c.toUpperCase());
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
