(function () {
  const CART_KEY = 'pawpals_cart_v1';

  function readCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  function addToCart(product) {
    const cart = readCart();
    const idx = cart.findIndex((i) => i.id === product.id);
    if (idx > -1) {
      cart[idx].qty += 1;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
    }
    saveCart(cart);
    toast('Added to cart');
    updateCartBadge();
  }

  function updateQty(id, delta) {
    const cart = readCart();
    const idx = cart.findIndex((i) => i.id === id);
    if (idx === -1) return;
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    saveCart(cart);
    renderCart();
    updateCartBadge();
  }

  function removeItem(id) {
    const cart = readCart().filter((i) => i.id !== id);
    saveCart(cart);
    renderCart();
    updateCartBadge();
  }

  function clearCart() {
    saveCart([]);
    renderCart();
    updateCartBadge();
  }

  function cartTotals() {
    const cart = readCart();
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    let shipping = subtotal > 0 ? 49 : 0;
    // Coupons
    const applied = (localStorage.getItem('pawpals_coupon') || '').toUpperCase();
    let discount = 0;
    if (applied === 'PAWPALS10') {
      discount = Math.round(subtotal * 0.1);
    }
    if (applied === 'FREESHIP') {
      shipping = subtotal > 0 ? 0 : 0;
    }
    const total = Math.max(0, subtotal - discount + shipping);
    return { subtotal, discount, shipping, total, applied };
  }

  function formatINR(v) {
    return `₹${v.toLocaleString('en-IN')}`;
  }

  function renderCart() {
    const listEl = document.getElementById('cart-items');
    if (!listEl) return; // Not on cart page

    const emptyEl = document.getElementById('cart-empty');
    const summaryEl = document.getElementById('cart-summary');
    const checkoutBtn = document.getElementById('checkout-btn');
    const container = document.querySelector('.cart-container');

    const items = readCart();
    listEl.innerHTML = '';

    if (!items.length) {
      if (emptyEl) emptyEl.style.display = 'block';
      if (summaryEl) summaryEl.style.display = 'none';
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.6';
        checkoutBtn.style.cursor = 'not-allowed';
      }
      if (container) container.classList.add('is-empty');
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (summaryEl) summaryEl.style.display = 'block';
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.style.opacity = '1';
      checkoutBtn.style.cursor = 'pointer';
    }
    if (container) container.classList.remove('is-empty');

    // Add header labels row
    const head = document.createElement('div');
    head.className = 'cart-head';
    head.innerHTML = `
      <div>Item</div>
      <div class="head-center">Qty</div>
      <div class="head-right">Price</div>
      <div class="head-right">Total</div>
    `;
    listEl.appendChild(head);

    items.forEach((i) => {
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <div class="cart-item">
          <img src="${i.image}" alt="${i.name}" class="ci-img" />
          <div class="ci-info">
            <h4 class="ci-name">${i.name}</h4>
            <div class="ci-price">${formatINR(i.price)}</div>
          </div>
        </div>
        <div class="cart-qty">
          <button class="qty-btn" data-action="dec" data-id="${i.id}" aria-label="Decrease quantity"><i class='bx bx-minus'></i></button>
          <span class="qty">${i.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${i.id}" aria-label="Increase quantity"><i class='bx bx-plus'></i></button>
        </div>
        <div class="cart-line-total">${formatINR(i.price * i.qty)}</div>
        <button class="remove-btn" aria-label="Remove" title="Remove" data-action="rm" data-id="${i.id}"><i class='bx bx-trash'></i></button>
      `;
      listEl.appendChild(row);
    });

    listEl.querySelectorAll('.qty-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        updateQty(id, action === 'inc' ? 1 : -1);
      });
    });
    listEl.querySelectorAll('.remove-btn').forEach((btn) => {
      btn.addEventListener('click', () => removeItem(btn.getAttribute('data-id')));
    });

    const { subtotal, discount, shipping, total, applied } = cartTotals();
    const subEl = document.getElementById('subtotal');
    const discEl = document.getElementById('discount');
    const shipEl = document.getElementById('shipping');
    const totEl = document.getElementById('total');
    if (subEl) subEl.textContent = formatINR(subtotal);
    if (discEl) {
      discEl.textContent = discount > 0 ? `- ${formatINR(discount)}` : formatINR(0);
      discEl.parentElement.style.display = discount > 0 ? 'flex' : 'none';
    }
    if (shipEl) shipEl.textContent = formatINR(shipping);
    if (totEl) totEl.textContent = formatINR(total);

    // Save for payment page if needed
    localStorage.setItem('pawpals_cart_total', String(total));

    // Reflect coupon input value
    const couponInput = document.getElementById('coupon-code');
    if (couponInput) couponInput.value = applied || '';
  }

  function applyCouponFromInput() {
    const input = document.getElementById('coupon-code');
    if (!input) return;
    const code = (input.value || '').toUpperCase().trim();
    if (!code) {
      localStorage.removeItem('pawpals_coupon');
      toast('Coupon cleared');
      renderCart();
      return;
    }
    const valid = ['PAWPALS10', 'FREESHIP'];
    if (!valid.includes(code)) {
      toast('Invalid coupon');
      return;
    }
    localStorage.setItem('pawpals_coupon', code);
    toast(`Applied ${code}`);
    renderCart();
  }

  function updateCartBadge() {
    const count = readCart().reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    badge.textContent = String(count);
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 200);
    }, 1500);
  }

  function attachAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach((btn) => {
      btn.addEventListener('click', () => {
        const product = {
          id: btn.getAttribute('data-id'),
          name: btn.getAttribute('data-name'),
          price: Number(btn.getAttribute('data-price') || 0),
          image: btn.getAttribute('data-image') || ''
        };
        addToCart(product);
      });
    });
  }

  // Expose a global binder for pages that render products dynamically
  window.pawpalsBindAddToCart = attachAddToCartButtons;

  document.addEventListener('DOMContentLoaded', () => {
    attachAddToCartButtons();
    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) clearBtn.addEventListener('click', clearCart);
    const applyBtn = document.getElementById('apply-coupon');
    if (applyBtn) applyBtn.addEventListener('click', applyCouponFromInput);
    renderCart();
    updateCartBadge();
  });
})();

/* Minimal styles for cart rows and toast; keep here to avoid heavy CSS edits */
(function injectStyles() {
  const css = `
  .cart-container { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 320px; gap: 16px; align-items: start; }
  .cart-left { min-width: 0; }
  .cart-container.is-empty { grid-template-columns: 1fr; justify-items: center; }
  .cart-container.is-empty .empty-state { max-width: 520px; margin: 40px auto; }
  .cart-list { display: grid; gap: 10px; max-width: 900px; margin: 0 auto; }
  .cart-head { display: grid; grid-template-columns: 1fr auto auto auto; gap: 12px; padding: 0 6px; color:#6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
  .cart-head .head-center { text-align:center; }
  .cart-head .head-right { text-align:right; }
  .cart-row { display: grid; grid-template-columns: 1fr auto auto auto; align-items: center; gap: 12px; padding: 12px; background:#fff; border:1px solid #eee; border-radius:10px; }
  .cart-item { display:flex; align-items:center; gap:12px; }
  .ci-img { width:80px; height:80px; object-fit:cover; border-radius:8px; }
  .ci-name { font-size: 0.95rem; margin:0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .ci-price { color:#555; font-size: 0.85rem; }
  .cart-qty { display:flex; align-items:center; gap:8px; }
  .qty-btn { width:28px; height:28px; border:none; background:#f1f5ff; color:#1d4ed8; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; line-height:1; }
  .qty-btn i { font-size:18px; line-height:1; display:block; }
  .cart-qty .qty { min-width:24px; text-align:center; display:inline-block; }
  .remove-btn { border:none; background:#fee2e2; color:#b91c1c; width:32px; height:32px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; }
  .remove-btn i { font-size:18px; line-height:1; }
  .cart-summary { position: sticky; top: 100px; background:#fff; border:1px solid #eee; border-radius: 10px; padding: 16px; }
  .summary-row { display:flex; justify-content: space-between; margin: 6px 0; }
  .summary-row.total { font-weight:700; font-size:1.05rem; }
  .summary-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:10px; }
  .coupon { display:grid; grid-template-columns: 1fr auto; gap:8px; margin: 8px 0 6px; }
  .coupon input { border:1px solid #e5e7eb; border-radius:8px; padding:10px 12px; font-size:14px; }
  .btn-primary { background:#022a80; color:#fff; padding:10px 16px; border-radius:8px; border:none; cursor:pointer; text-decoration:none; display:inline-block; font-weight:700; }
  .btn-secondary { background:#eef2ff; color:#1f2937; padding:10px 16px; border-radius:8px; border:none; cursor:pointer; text-decoration:none; display:inline-block; font-weight:600; }
  .empty-state { text-align:center; background:#fff; border:1px solid #eee; border-radius:12px; padding:24px; }
  .empty-graphic { font-size:42px; margin-bottom:8px; }
  .empty-actions { display:flex; gap:10px; justify-content:center; margin-top:10px; flex-wrap:wrap; }
  .toast { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%) translateY(10px); background: #022a80; color: #fff; padding: 8px 14px; border-radius: 8px; opacity: 0; transition: all .2s; z-index: 9999; }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  .end a.cart-link { position: relative; }
  .cart-count-badge { display:none; position:absolute; top:-6px; right:-6px; min-width:18px; height:18px; padding:0 5px; background:#e11d48; color:#fff; border-radius:999px; font-size:11px; line-height:18px; align-items:center; justify-content:center; font-weight:700; }
  @media (max-width: 900px) { .cart-container { grid-template-columns: 1fr; } .cart-summary { position: static; } .ci-img{ width:64px; height:64px; } }
  @media (max-width: 640px) { .cart-head { display:none; } .cart-row { grid-template-columns: 1fr auto auto; } .remove-btn { grid-column: 1 / -1; justify-self: end; } }
  `;
  const style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);
})();
