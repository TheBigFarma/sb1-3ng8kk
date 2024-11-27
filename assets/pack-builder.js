class PackBuilder {
  constructor() {
    this.container = document.querySelector('[data-pack-builder]');
    if (!this.container) return;

    this.selectedItems = new Map();
    this.summaryContainer = this.container.querySelector('[data-selected-items]');
    this.subtotalElement = this.container.querySelector('[data-subtotal]');
    this.discountElement = this.container.querySelector('[data-discount]');
    this.totalElement = this.container.querySelector('[data-total]');
    this.addToCartButton = this.container.querySelector('[data-add-pack-to-cart]');

    this.bindEvents();
  }

  bindEvents() {
    // Quantity changes
    this.container.addEventListener('click', (event) => {
      const product = event.target.closest('[data-product-id]');
      if (!product) return;

      if (event.target.matches('[data-quantity-plus]')) {
        this.updateQuantity(product, 1);
      } else if (event.target.matches('[data-quantity-minus]')) {
        this.updateQuantity(product, -1);
      }
    });

    // Variant changes
    this.container.addEventListener('change', (event) => {
      if (event.target.matches('[data-variant-select]')) {
        const product = event.target.closest('[data-product-id]');
        this.updateVariant(product);
      }
    });

    // Add pack to cart
    this.addToCartButton?.addEventListener('click', () => this.addPackToCart());
  }

  updateQuantity(product, change) {
    const input = product.querySelector('[data-quantity-input]');
    const newValue = parseInt(input.value) + change;
    
    if (newValue >= 0 && newValue <= 10) {
      input.value = newValue;
      this.updateSelectedItems(product);
    }
  }

  updateVariant(product) {
    this.updateSelectedItems(product);
  }

  updateSelectedItems(product) {
    const productId = product.dataset.productId;
    const quantity = parseInt(product.querySelector('[data-quantity-input]').value);
    const variantSelect = product.querySelector('[data-variant-select]');
    const variantId = variantSelect.value;
    const price = parseFloat(variantSelect.selectedOptions[0].dataset.price);
    const title = product.querySelector('h3').textContent;

    if (quantity > 0) {
      this.selectedItems.set(productId, {
        variantId,
        quantity,
        price,
        title
      });
    } else {
      this.selectedItems.delete(productId);
    }

    this.updateSummary();
  }

  updateSummary() {
    // Update selected items display
    this.summaryContainer.innerHTML = '';
    this.selectedItems.forEach((item, productId) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'pack-builder__selected-item';
      itemElement.innerHTML = `
        <span>${item.title} x ${item.quantity}</span>
        <span>${this.formatMoney(item.price * item.quantity)}</span>
      `;
      this.summaryContainer.appendChild(itemElement);
    });

    // Calculate totals
    const subtotal = this.calculateSubtotal();
    const discount = this.calculateDiscount(subtotal);
    const total = subtotal - discount;

    // Update display
    this.subtotalElement.textContent = this.formatMoney(subtotal);
    this.discountElement.textContent = `-${this.formatMoney(discount)}`;
    this.totalElement.textContent = this.formatMoney(total);

    // Enable/disable add to cart button
    this.addToCartButton.disabled = this.selectedItems.size === 0;
  }

  calculateSubtotal() {
    let subtotal = 0;
    this.selectedItems.forEach(item => {
      subtotal += item.price * item.quantity;
    });
    return subtotal;
  }

  calculateDiscount(subtotal) {
    // Apply discount based on number of items
    const itemCount = Array.from(this.selectedItems.values())
      .reduce((sum, item) => sum + item.quantity, 0);
    
    if (itemCount >= 5) return subtotal * 0.2; // 20% off for 5+ items
    if (itemCount >= 3) return subtotal * 0.15; // 15% off for 3-4 items
    if (itemCount >= 2) return subtotal * 0.1; // 10% off for 2 items
    return 0;
  }

  async addPackToCart() {
    try {
      const items = Array.from(this.selectedItems.values()).map(item => ({
        id: item.variantId,
        quantity: item.quantity
      }));

      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items })
      });

      const cart = await response.json();
      
      // Update cart count
      const cartCount = document.querySelector('.header__cart-count');
      if (cartCount) {
        cartCount.textContent = cart.item_count;
      }

      // Open cart drawer
      document.dispatchEvent(new CustomEvent('cart-drawer:open'));

      // Reset pack builder
      this.resetPackBuilder();
    } catch (error) {
      console.error('Error adding pack to cart:', error);
    }
  }

  resetPackBuilder() {
    // Reset quantities
    this.container.querySelectorAll('[data-quantity-input]')
      .forEach(input => input.value = 0);

    // Clear selected items
    this.selectedItems.clear();
    this.updateSummary();
  }

  formatMoney(cents) {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }
}

// Initialize pack builder
document.addEventListener('DOMContentLoaded', () => {
  new PackBuilder();
});