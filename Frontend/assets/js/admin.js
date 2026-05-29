
const API_BASE = 'http://localhost:8080';

//Initialization
document.addEventListener('DOMContentLoaded', function() {
  const user = getStoredUser();

  if (!user || user.role !== 'ROLE_ADMIN') {
    window.location.href = '../index.html';
    return;
  }

  updateAuthUI();
  initTabs();
  loadProducts();
  loadCategories();
  bindProductForm();
  bindCategoryForm();
});

//Auth UI
function updateAuthUI() {
  const user = getStoredUser();
  document.getElementById('user-greeting').innerHTML = 'Admin: <strong>' + escapeHtml(user.username) + '</strong>';
  document.getElementById('logout-btn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('sm_user');
    localStorage.removeItem('sm_cart');
    window.location.href = '../index.html';
  });
}

//Tab Switching 
function initTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
      document.getElementById('section-' + this.dataset.tab).classList.add('active');
    });
  });
}

//Auth Header 
function authHeaders(contentType) {
  const user = getStoredUser();
  const headers = {
    'Authorization': 'Basic ' + btoa(user.username + ':' + user.password)
  };
  if (contentType) headers['Content-Type'] = contentType;
  return headers;
}

// PRODUCTS
async function loadProducts() {
  try {
    const res = await fetch(API_BASE + '/product/all');
    const products = res.ok ? await res.json() : [];
    renderProductsTable(products);
  } catch {
    renderProductsTable([]);
  }
}

function renderProductsTable(products) {
  const wrap = document.getElementById('products-table-wrap');
  if (products.length === 0) {
    wrap.innerHTML = '<p class="text-muted">No products found. Add one above.</p>';
    return;
  }

  let html = `
    <table class="admin-table" id="products-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Available</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  products.forEach(p => {
    html += `
      <tr data-product-id="${p.productId}">
        <td>${p.productId}</td>
        <td>${escapeHtml(p.name)}</td>
        <td>${p.category ? escapeHtml(p.category.name) : '—'}</td>
        <td>₹${p.price}</td>
        <td>${p.quantity}</td>
        <td>${p.available ? '✓' : '✗'}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="editProduct(${p.productId})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.productId})">Delete</button>
        </td>
      </tr>
    `;
  });

  html += '</tbody></table>';
  wrap.innerHTML = html;
}

// Product Form 
function bindProductForm() {
  document.getElementById('btn-add-product').addEventListener('click', function() {
    removeInlineEditForms();
    resetProductForm();
    document.getElementById('product-form-title').textContent = 'Add New Product';
    document.getElementById('pf-submit-btn').textContent = 'Save Product';
    document.getElementById('product-form-card').style.display = 'block';
    document.getElementById('product-form-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  document.getElementById('pf-cancel-btn').addEventListener('click', function() {
    document.getElementById('product-form-card').style.display = 'none';
    removeInlineEditForms();
  });

  document.getElementById('product-form').addEventListener('submit', handleProductSubmit);
}

function resetProductForm() {
  document.getElementById('pf-id').value = '';
  document.getElementById('pf-name').value = '';
  document.getElementById('pf-price').value = '';
  document.getElementById('pf-category').value = '';
  document.getElementById('pf-quantity').value = '';
  document.getElementById('pf-photo').value = '';
  document.getElementById('pf-desc').value = '';
  document.getElementById('pf-available').checked = true;
  document.getElementById('product-form-error').classList.remove('visible');
}

async function handleProductSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('pf-id').value;
  const name = document.getElementById('pf-name').value.trim();
  const price = parseFloat(document.getElementById('pf-price').value);
  const categoryId = parseInt(document.getElementById('pf-category').value);
  const quantity = parseInt(document.getElementById('pf-quantity').value) || 0;
  const photoPath = document.getElementById('pf-photo').value.trim() || 'placeholder';
  const description = document.getElementById('pf-desc').value.trim();
  const available = document.getElementById('pf-available').checked;

  if (!name || isNaN(price) || isNaN(categoryId) || !description) {
    showFormError('product-form-error', 'Please fill in all required fields.');
    return;
  }

  const payload = {
    name, price, photoPath, description, available, quantity,
    category: { categoryId: categoryId }
  };

  const isEdit = id !== '';
  if (isEdit) payload.productId = parseInt(id);

  try {
    const res = await fetch(API_BASE + '/product/' + (isEdit ? 'update' : 'add'), {
      method: isEdit ? 'PUT' : 'POST',
      headers: authHeaders('application/json'),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to save product.');
    }

    showToast(isEdit ? 'Product updated!' : 'Product added!', 'success');
    document.getElementById('product-form-card').style.display = 'none';
    removeInlineEditForms();
    loadProducts();
  } catch (err) {
    showFormError('product-form-error', err.message);
  }
}

async function editProduct(productId) {
  try {
    const res = await fetch(API_BASE + '/product/' + productId);
    if (!res.ok) throw new Error('Product not found');
    const p = await res.json();

    // Remove any existing inline forms
    removeInlineEditForms();
    // Hide the top-level add form
    document.getElementById('product-form-card').style.display = 'none';

    const row = document.querySelector('tr[data-product-id="' + productId + '"]');
    if (!row) return;

    const colCount = row.children.length;
    const formRow = document.createElement('tr');
    formRow.className = 'inline-edit-row';
    formRow.innerHTML = `
      <td colspan="${colCount}">
        <div class="admin-form-card inline-form-card">
          <h4>Edit Product #${p.productId}</h4>
          <form id="inline-product-form" novalidate>
            <input type="hidden" id="ipf-id" value="${p.productId}">
            <div class="form-row">
              <div class="form-group">
                <label>Product Name</label>
                <input type="text" id="ipf-name" class="form-control" value="${escapeHtml(p.name)}" required>
              </div>
              <div class="form-group">
                <label>Price (₹)</label>
                <input type="number" id="ipf-price" class="form-control" value="${p.price}" min="0" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Category ID</label>
                <input type="number" id="ipf-category" class="form-control" value="${p.category ? p.category.categoryId : ''}" required>
              </div>
              <div class="form-group">
                <label>Quantity</label>
                <input type="number" id="ipf-quantity" class="form-control" value="${p.quantity}" min="0" required>
              </div>
            </div>
            <div class="form-group">
              <label>Photo URL</label>
              <input type="text" id="ipf-photo" class="form-control" value="${escapeHtml(p.photoPath || '')}">
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea id="ipf-desc" class="form-control" rows="2" required>${escapeHtml(p.description || '')}</textarea>
            </div>
            <div class="form-group">
              <label><input type="checkbox" id="ipf-available" ${p.available ? 'checked' : ''}> Available for sale</label>
            </div>
            <div id="ipf-error" class="form-error"></div>
            <div class="admin-form-actions">
              <button type="submit" class="btn btn-primary">Update Product</button>
              <button type="button" class="btn btn-secondary" onclick="removeInlineEditForms()">Cancel</button>
            </div>
          </form>
        </div>
      </td>
    `;

    row.after(formRow);
    formRow.scrollIntoView({ behavior: 'smooth', block: 'center' });

    document.getElementById('inline-product-form').addEventListener('submit', handleInlineProductSubmit);

  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function handleInlineProductSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('ipf-id').value;
  const name = document.getElementById('ipf-name').value.trim();
  const price = parseFloat(document.getElementById('ipf-price').value);
  const categoryId = parseInt(document.getElementById('ipf-category').value);
  const quantity = parseInt(document.getElementById('ipf-quantity').value) || 0;
  const photoPath = document.getElementById('ipf-photo').value.trim() || 'placeholder';
  const description = document.getElementById('ipf-desc').value.trim();
  const available = document.getElementById('ipf-available').checked;

  if (!name || isNaN(price) || isNaN(categoryId) || !description) {
    showFormError('ipf-error', 'Please fill in all required fields.');
    return;
  }

  const payload = {
    productId: parseInt(id),
    name, price, photoPath, description, available, quantity,
    category: { categoryId: categoryId }
  };

  try {
    const res = await fetch(API_BASE + '/product/update', {
      method: 'PUT',
      headers: authHeaders('application/json'),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update product.');
    }

    showToast('Product updated!', 'success');
    removeInlineEditForms();
    loadProducts();
  } catch (err) {
    showFormError('ipf-error', err.message);
  }
}

async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    const res = await fetch(API_BASE + '/product/delete/' + productId, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete product');
    showToast('Product deleted.', 'success');
    loadProducts();
  } catch (err) {
    showToast(err.message, 'error');
  }
}


// CATEGORIES
async function loadCategories() {
  try {
    const res = await fetch(API_BASE + '/category/all');
    const categories = res.ok ? await res.json() : [];
    renderCategoriesTable(categories);
  } catch {
    renderCategoriesTable([]);
  }
}

function renderCategoriesTable(categories) {
  const wrap = document.getElementById('categories-table-wrap');
  if (categories.length === 0) {
    wrap.innerHTML = '<p class="text-muted">No categories found. Add one above.</p>';
    return;
  }

  let html = `
    <table class="admin-table" id="categories-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  categories.forEach(c => {
    html += `
      <tr data-category-id="${c.categoryId}">
        <td>${c.categoryId}</td>
        <td>${escapeHtml(c.name)}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="editCategory(${c.categoryId}, '${escapeHtml(c.name)}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCategory(${c.categoryId})">Delete</button>
        </td>
      </tr>
    `;
  });

  html += '</tbody></table>';
  wrap.innerHTML = html;
}

// Category Form 
function bindCategoryForm() {
  document.getElementById('btn-add-category').addEventListener('click', function() {
    removeInlineEditForms();
    document.getElementById('cf-id').value = '';
    document.getElementById('cf-name').value = '';
    document.getElementById('category-form-title').textContent = 'Add New Category';
    document.getElementById('cf-submit-btn').textContent = 'Save Category';
    document.getElementById('category-form-card').style.display = 'block';
    document.getElementById('category-form-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  document.getElementById('cf-cancel-btn').addEventListener('click', function() {
    document.getElementById('category-form-card').style.display = 'none';
    removeInlineEditForms();
  });

  document.getElementById('category-form').addEventListener('submit', handleCategorySubmit);
}

async function handleCategorySubmit(e) {
  e.preventDefault();
  const id = document.getElementById('cf-id').value;
  const name = document.getElementById('cf-name').value.trim();

  if (!name || name.length < 3) {
    showFormError('category-form-error', 'Category name must be at least 3 characters.');
    return;
  }

  const payload = { name };
  const isEdit = id !== '';
  if (isEdit) payload.categoryId = parseInt(id);

  try {
    const res = await fetch(API_BASE + '/category/' + (isEdit ? 'update' : 'add'), {
      method: isEdit ? 'PUT' : 'POST',
      headers: authHeaders('application/json'),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to save category.');
    }

    showToast(isEdit ? 'Category updated!' : 'Category added!', 'success');
    document.getElementById('category-form-card').style.display = 'none';
    removeInlineEditForms();
    loadCategories();
  } catch (err) {
    showFormError('category-form-error', err.message);
  }
}

function editCategory(categoryId, name) {
  // Remove any existing inline forms
  removeInlineEditForms();
  // Hide the top-level add form
  document.getElementById('category-form-card').style.display = 'none';

  const row = document.querySelector('tr[data-category-id="' + categoryId + '"]');
  if (!row) return;

  const colCount = row.children.length;
  const formRow = document.createElement('tr');
  formRow.className = 'inline-edit-row';
  formRow.innerHTML = `
    <td colspan="${colCount}">
      <div class="admin-form-card inline-form-card">
        <h4>Edit Category #${categoryId}</h4>
        <form id="inline-category-form" novalidate>
          <input type="hidden" id="icf-id" value="${categoryId}">
          <div class="form-group">
            <label>Category Name</label>
            <input type="text" id="icf-name" class="form-control" value="${escapeHtml(name)}" required>
          </div>
          <div id="icf-error" class="form-error"></div>
          <div class="admin-form-actions">
            <button type="submit" class="btn btn-primary">Update Category</button>
            <button type="button" class="btn btn-secondary" onclick="removeInlineEditForms()">Cancel</button>
          </div>
        </form>
      </div>
    </td>
  `;

  row.after(formRow);
  formRow.scrollIntoView({ behavior: 'smooth', block: 'center' });

  document.getElementById('inline-category-form').addEventListener('submit', handleInlineCategorySubmit);
}

async function handleInlineCategorySubmit(e) {
  e.preventDefault();
  const id = document.getElementById('icf-id').value;
  const name = document.getElementById('icf-name').value.trim();

  if (!name || name.length < 3) {
    showFormError('icf-error', 'Category name must be at least 3 characters.');
    return;
  }

  const payload = { categoryId: parseInt(id), name };

  try {
    const res = await fetch(API_BASE + '/category/update', {
      method: 'PUT',
      headers: authHeaders('application/json'),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update category.');
    }

    showToast('Category updated!', 'success');
    removeInlineEditForms();
    loadCategories();
  } catch (err) {
    showFormError('icf-error', err.message);
  }
}

async function deleteCategory(categoryId) {
  if (!confirm('Are you sure you want to delete this category?')) return;

  try {
    const res = await fetch(API_BASE + '/category/delete/' + categoryId, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete category');
    showToast('Category deleted.', 'success');
    loadCategories();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Inline Form Helpers 
function removeInlineEditForms() {
  document.querySelectorAll('.inline-edit-row').forEach(row => row.remove());
}

// Utilities 
function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('sm_user'));
  } catch {
    return null;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showFormError(elementId, message) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.classList.add('visible');
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
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
window.removeInlineEditForms = removeInlineEditForms;
