const state = {
  selectedProductId: null,
  currentSessionId: null
};

const companyForm = document.getElementById('companyForm');
const productForm = document.getElementById('productForm');
const resourceForm = document.getElementById('resourceForm');
const issueForm = document.getElementById('issueForm');
const answerForm = document.getElementById('answerForm');
const companySelect = document.getElementById('companySelect');
const productsEl = document.getElementById('products');
const productDetailsEl = document.getElementById('productDetails');
const resourceWrap = document.getElementById('resourceWrap');
const assistantWrap = document.getElementById('assistantWrap');
const searchInput = document.getElementById('searchInput');
const chatEl = document.getElementById('chat');

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Request failed');
  }

  return response.json();
}

function showMessage(kind, text) {
  const div = document.createElement('div');
  div.className = `msg ${kind}`;
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function renderCompanies(companies) {
  companySelect.innerHTML = companies
    .map((company) => `<option value="${company.id}">${company.name}</option>`)
    .join('');
}

function renderProducts(products) {
  if (!products.length) {
    productsEl.innerHTML = '<p>No products found.</p>';
    return;
  }

  productsEl.innerHTML = products
    .map((product) => `
      <article class="product-card">
        <h4>${product.name}</h4>
        <small>${product.category} · ${product.company?.name || 'Unknown company'} · ${product.resourceCount} resources</small>
        <p>${product.description || ''}</p>
        <button data-id="${product.id}">Open</button>
      </article>
    `)
    .join('');

  for (const button of productsEl.querySelectorAll('button[data-id]')) {
    button.addEventListener('click', () => loadProduct(button.dataset.id));
  }
}

function renderResources(resources) {
  if (!resources.length) {
    return '<p>No resources added yet.</p>';
  }

  return resources
    .map((resource) => `
      <div class="resource-item">
        <strong>${resource.title}</strong> (${resource.type})<br/>
        ${resource.externalUrl ? `<a href="${resource.externalUrl}" target="_blank">Open link</a>` : ''}
        ${resource.filePath ? `<a href="${resource.filePath}" target="_blank">Open file</a>` : ''}
      </div>
    `)
    .join('');
}

async function refreshCompaniesAndProducts() {
  const [companies, products] = await Promise.all([
    api('/api/companies'),
    api('/api/products')
  ]);

  renderCompanies(companies);
  renderProducts(products);
}

async function loadProduct(productId) {
  state.selectedProductId = productId;
  state.currentSessionId = null;
  answerForm.classList.add('hidden');
  chatEl.innerHTML = '';

  const product = await api(`/api/products/${productId}`);
  productDetailsEl.innerHTML = `
    <h3>${product.name}</h3>
    <p><strong>Category:</strong> ${product.category}</p>
    <p>${product.description || ''}</p>
    ${product.imageUrl ? `<img src="${product.imageUrl}" style="max-width: 100%; border-radius: 10px;" />` : ''}
    <h4>Knowledge Repository</h4>
    ${renderResources(product.resources)}
  `;

  resourceWrap.classList.remove('hidden');
  assistantWrap.classList.remove('hidden');
}

companyForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(companyForm);
  const payload = Object.fromEntries(formData.entries());
  await api('/api/companies', { method: 'POST', body: JSON.stringify(payload) });
  companyForm.reset();
  await refreshCompaniesAndProducts();
});

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(productForm);
  const payload = Object.fromEntries(formData.entries());
  await api('/api/products', { method: 'POST', body: JSON.stringify(payload) });
  productForm.reset();
  await refreshCompaniesAndProducts();
});

resourceForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!state.selectedProductId) {
    alert('Select a product first.');
    return;
  }

  const formData = new FormData(resourceForm);
  const response = await fetch(`/api/products/${state.selectedProductId}/resources`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    alert(payload.error || 'Upload failed');
    return;
  }

  resourceForm.reset();
  await loadProduct(state.selectedProductId);
  await refreshCompaniesAndProducts();
});

issueForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!state.selectedProductId) {
    alert('Select a product first.');
    return;
  }

  const formData = new FormData(issueForm);
  const payload = Object.fromEntries(formData.entries());
  const result = await api(`/api/products/${state.selectedProductId}/issues`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  state.currentSessionId = result.sessionId;
  chatEl.innerHTML = '';
  showMessage('user', payload.issueText);

  if (result.assistant.type === 'question') {
    showMessage('bot', `${result.assistant.question} ${result.assistant.hint ? `\nHint: ${result.assistant.hint}` : ''}`);
    answerForm.classList.remove('hidden');
  } else {
    showMessage('bot', 'Diagnosis ready.');
  }

  issueForm.reset();
});

answerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!state.currentSessionId) {
    return;
  }

  const formData = new FormData(answerForm);
  const answerText = formData.get('answerText');
  showMessage('user', answerText);

  const result = await api(`/api/assistant/${state.currentSessionId}/message`, {
    method: 'POST',
    body: JSON.stringify({ answerText })
  });

  if (result.assistant.type === 'question') {
    showMessage('bot', `${result.assistant.question}${result.assistant.hint ? `\nHint: ${result.assistant.hint}` : ''}`);
  } else {
    const lines = [];
    lines.push('Most likely causes:');
    for (const cause of result.assistant.topCauses) {
      lines.push(`- ${cause.title} (${cause.confidence}% confidence)`);
    }
    lines.push('Recommended actions:');
    for (const action of result.assistant.recommendedActions) {
      lines.push(`- ${action.action} [${action.reference}]`);
    }
    showMessage('bot', lines.join('\n'));
    answerForm.classList.add('hidden');
  }

  answerForm.reset();
});

searchInput.addEventListener('input', async () => {
  const q = searchInput.value.trim();
  const products = await api(`/api/products?q=${encodeURIComponent(q)}`);
  renderProducts(products);
});

refreshCompaniesAndProducts().catch((error) => {
  console.error(error);
  alert(error.message);
});
