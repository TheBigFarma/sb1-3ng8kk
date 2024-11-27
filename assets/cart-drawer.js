class CartDrawer {
  constructor() {
    this.drawer = document.querySelector('[data-cart-drawer]');
    this.closeButton = document.querySelector('[data-cart-drawer-close]');
    this.bindEvents();
  }

  bindEvents() {
    // Cart drawer open/close
    document.addEventListener('click', (event) => {
      if (event.target.matches('[data-cart-drawer-trigger]')) {
        this.open();
      }
    });

    this.closeButton?.addEventListener('click', () => this.close());

    // Quantity updates
    this.drawer?.addEventListener('click', (event) => {
      if (event.target.matches('[data-quantity-plus]')) {
        this.updateQuantity(event.target.dataset.itemKey, 1);
      } else if (event.target.matches('[data-quantity-minus]')) {
        this.updateQuantity(event.target.dataset.itemKey, -1);
      } else if (event.target.matches('[data-item-remove]')) {
        this.removeItem(event.target.dataset.itemKey);
      }
    });
  }

  async updateQuantity(key, change) {
    const item = this.drawer.querySelector(`[data-cart-item="${key}"]`);
    const input = item.querySelector('[data-quantity-input]');
    const newQuantity = parseInt(input.value) + change;

    if (newQuantity < 0) return;

    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: key,
          quantity: newQuantity
        })
      });

      const cart = await response.json();
      this.updateCart(cart);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }

  async removeItem(key) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: key,
          quantity: 0
        })
      });

      const cart = await response.json();
      this.updateCart(cart);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  updateCart(cart) {
    // Update cart count
    const cartCount = document.querySelector('.header__cart-count');
    if (cartCount) {
      cartCount.textContent = cart.item_count;
    }

    // Refresh cart drawer content
    this.refreshDrawer();
  }

  async refreshDrawer() {
    try {
      const response = await fetch('?section_id=cart-drawer');
      const html = await response.text();
      this.drawer.innerHTML = html;
    } catch (error) {
      console.error('Error refreshing cart drawer:', error);
    }
  }

  open() {
    this.drawer?.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.drawer?.classList.remove('is-active');
    document.body.style.overflow = '';
  }
}

// Initialize cart drawer
document.addEventListener('DOMContentLoaded', () => {
  new CartDrawer();
});