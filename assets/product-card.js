class ProductCard {
  constructor(card) {
    this.card = card;
    this.productHandle = card.dataset.productHandle;
    this.addToCartButton = card.querySelector('[data-add-to-cart]');
    this.variantSelect = card.querySelector('[data-product-select]');
    this.quickViewTrigger = card.querySelector('[data-quick-view-trigger]');
    
    this.bindEvents();
  }

  bindEvents() {
    this.addToCartButton?.addEventListener('click', (e) => {
      e.preventDefault();
      this.addToCart();
    });

    this.quickViewTrigger?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openQuickView();
    });

    this.variantSelect?.addEventListener('change', () => {
      this.updatePrice();
    });
  }

  async addToCart() {
    const variantId = this.variantSelect?.value;
    if (!variantId) return;

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: variantId,
            quantity: 1
          }]
        })
      });

      const cart = await response.json();
      this.updateCartCount(cart);
      this.openCartDrawer();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  async openQuickView() {
    try {
      const response = await fetch(`/products/${this.productHandle}?view=quick-view`);
      const html = await response.text();
      
      // Dispatch event for quick view modal
      const event = new CustomEvent('quick-view:open', {
        detail: { content: html }
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error('Error loading quick view:', error);
    }
  }

  updateCartCount(cart) {
    const cartCount = document.querySelector('.header__cart-count');
    if (cartCount) {
      cartCount.textContent = cart.item_count;
    }
  }

  openCartDrawer() {
    const event = new CustomEvent('cart-drawer:open');
    document.dispatchEvent(event);
  }

  async updatePrice() {
    const variantId = this.variantSelect.value;
    try {
      const response = await fetch(`/products/${this.productHandle}/variants/${variantId}.js`);
      const variant = await response.json();
      
      // Update price display
      const priceElement = this.card.querySelector('.product-card__price');
      if (priceElement) {
        priceElement.innerHTML = this.formatMoney(variant.price);
      }
    } catch (error) {
      console.error('Error updating price:', error);
    }
  }

  formatMoney(cents) {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }
}

// Initialize all product cards
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-product-card]').forEach(card => {
    new ProductCard(card);
  });
});