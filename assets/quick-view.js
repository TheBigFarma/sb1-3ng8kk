class QuickView {
  constructor() {
    this.modal = document.querySelector('[data-quick-view-modal]');
    this.modalBody = this.modal?.querySelector('[data-quick-view-body]');
    this.bindEvents();
  }

  bindEvents() {
    // Quick view triggers
    document.addEventListener('click', (event) => {
      if (event.target.matches('[data-quick-view-trigger]')) {
        const handle = event.target.dataset.productHandle;
        this.open(handle);
      }
    });

    // Close modal
    this.modal?.addEventListener('click', (event) => {
      if (event.target.matches('[data-quick-view-close]')) {
        this.close();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.modal?.classList.contains('is-active')) {
        this.close();
      }
    });

    // Product form submission
    this.modal?.addEventListener('submit', (event) => {
      if (event.target.matches('[data-product-form]')) {
        event.preventDefault();
        this.addToCart(event.target);
      }
    });

    // Thumbnail clicks
    this.modal?.addEventListener('click', (event) => {
      if (event.target.closest('[data-thumbnail]')) {
        const button = event.target.closest('[data-thumbnail]');
        this.switchImage(button);
      }
    });

    // Variant changes
    this.modal?.addEventListener('change', (event) => {
      if (event.target.matches('[data-variant-select]')) {
        this.updatePrice(event.target);
      }
    });
  }

  async open(handle) {
    try {
      const response = await fetch(`/products/${handle}?view=quick-view`);
      const html = await response.text();
      
      this.modalBody.innerHTML = html;
      this.modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    } catch (error) {
      console.error('Error loading quick view:', error);
    }
  }

  close() {
    this.modal.classList.remove('is-active');
    document.body.style.overflow = '';
    this.modalBody.innerHTML = '';
  }

  switchImage(thumbnailButton) {
    // Update active state
    this.modal.querySelectorAll('[data-thumbnail]').forEach(thumb => {
      thumb.classList.remove('is-active');
    });
    thumbnailButton.classList.add('is-active');

    // Update main image
    const mainImage = this.modal.querySelector('[data-main-image]');
    const newSrc = thumbnailButton.querySelector('img').src.replace('100x', '600x');
    mainImage.src = newSrc;
  }

  updatePrice(select) {
    const option = select.options[select.selectedIndex];
    const price = option.dataset.price;
    const comparePrice = option.dataset.comparePrice;

    const priceElement = this.modal.querySelector('.quick-view-product__price');
    if (priceElement) {
      if (comparePrice && comparePrice !== price) {
        priceElement.innerHTML = `
          <span class="quick-view-product__price--sale">${price}</span>
          <span class="quick-view-product__price--compare">${comparePrice}</span>
        `;
      } else {
        priceElement.innerHTML = `
          <span class="quick-view-product__price--regular">${price}</span>
        `;
      }
    }
  }

  async addToCart(form) {
    try {
      const formData = new FormData(form);
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      });

      const cart = await response.json();
      
      // Update cart count
      const cartCount = document.querySelector('.header__cart-count');
      if (cartCount) {
        cartCount.textContent = cart.item_count;
      }

      // Close quick view and open cart drawer
      this.close();
      document.dispatchEvent(new CustomEvent('cart-drawer:open'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }
}

// Initialize quick view
document.addEventListener('DOMContentLoaded', () => {
  new QuickView();
});