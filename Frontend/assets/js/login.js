
const API_BASE = 'http://localhost:8080';

//DOM References
const tabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');
const cartBadge = document.getElementById('cart-badge');

// Initialization
document.addEventListener('DOMContentLoaded', function() {
  // If already logged in, redirect to shop
  if (getStoredUser()) {
    window.location.href = '../index.html';
    return;
  }

  updateCartBadge();
  bindEvents();

  // Check URL params for pre-selected tab
  const params = new URLSearchParams(window.location.search);
  if (params.get('tab') === 'register') {
    switchTab('register');
  }
});

//Tab Switching
function switchTab(tabName) {
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });
  loginForm.classList.toggle('active', tabName === 'login');
  registerForm.classList.toggle('active', tabName === 'register');
  loginError.classList.remove('visible');
  registerError.classList.remove('visible');
}

//Event Binding
function bindEvents() {
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      switchTab(this.dataset.tab);
    });
  });
  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);
}

//Login Handler
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  if (!username || !password) {
    showError(loginError, 'Please fill in all fields.');
    return;
  }

  const btn = document.getElementById('login-btn');
  btn.disabled = true;
  btn.textContent = 'Signing in...';
  loginError.classList.remove('visible');

  try {
    // Call login endpoint to validate credentials and get user info
    const res = await fetch(API_BASE + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Invalid credentials');
    }

    // Store user session with role and credentials for Basic Auth
    const userSession = {
      username: username,
      password: password,
      userId: data.userId ? parseInt(data.userId) : null,
      role: data.role || 'ROLE_CUSTOMER',
      address: data.address || ''
    };
    localStorage.setItem('sm_user', JSON.stringify(userSession));

    showToast('Welcome back, ' + username + '!', 'success');

    // Redirect — adminto admin page, customer to indxe.html
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    if (redirect) {
      setTimeout(() => { window.location.href = redirect; }, 600);
    } else if (userSession.role === 'ROLE_ADMIN') {
      setTimeout(() => { window.location.href = 'admin.html'; }, 600);
    } else {
      setTimeout(() => { window.location.href = '../index.html'; }, 600);
    }

  } catch (err) {
    showError(loginError, err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
}

//Register Handler
async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  const address = document.getElementById('reg-address').value.trim();

  if (!username || !password || !address) {
    showError(registerError, 'Please fill in all fields.');
    return;
  }
  if (password.length < 6) {
    showError(registerError, 'Password must be at least 6 characters.');
    return;
  }

  const btn = document.getElementById('register-btn');
  btn.disabled = true;
  btn.textContent = 'Creating account...';
  registerError.classList.remove('visible');

  try {
    const res = await fetch(API_BASE + '/customer/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, address })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Registration failed. Username may already exist.');
    }

    showToast('Account created! Please sign in.', 'success');
    switchTab('login');
    document.getElementById('login-username').value = username;

  } catch (err) {
    showError(registerError, err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Create Account';
  }
}

//Utilities
function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('sm_user'));
  } catch {
    return null;
  }
}

function showError(element, message) {
  element.textContent = message;
  element.classList.add('visible');
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

function showToast(message, type) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast ' + (type || '');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
