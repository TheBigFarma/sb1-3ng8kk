class ProductFilters {
  constructor() {
    this.container = document.querySelector('[data-product-filters]');
    if (!this.container) return;

    this.checkboxes = this.container.querySelectorAll('[data-filter-checkbox]');
    this.priceSlider = this.container.querySelector('[data-price-slider]');
    this.priceMin = this.container.querySelector('[data-price-min]');
    this.priceMax = this.container.querySelector('[data-price-max]');
    this.sortSelect = this.container.querySelector('[data-sort-select]');
    this.clearButton = this.container.querySelector('[data-clear-filters]');
    this.applyButton = this.container.querySelector('[data-apply-filters]');
    
    this.bindEvents();
    this.initializeFromUrl();
  }

  bindEvents() {
    this.priceSlider?.addEventListener('input', () => this.updatePriceInputs());
    this.priceMin?.addEventListener('change', () => this.validatePriceInputs());
    this.priceMax?.addEventListener('change', () => this.validatePriceInputs());
    this.sortSelect?.addEventListener('change', () => this.handleSort());
    this.clearButton?.addEventListener('click', () => this.clearFilters());
    this.applyButton?.addEventListener('click', () => this.applyFilters());
  }

  initializeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    
    // Initialize checkboxes
    const filters = params.getAll('filter');
    filters.forEach(filter => {
      const checkbox = this.container.querySelector(`[value="${filter}"]`);
      if (checkbox) checkbox.checked = true;
    });

    // Initialize price range
    const minPrice = params.get('min_price');
    const maxPrice = params.get('max_price');
    if (minPrice) this.priceMin.value = minPrice;
    if (maxPrice) this.priceMax.value = maxPrice;

    // Initialize sort
    const sort = params.get('sort_by');
    if (sort) this.sortSelect.value = sort;
  }

  updatePriceInputs() {
    const value = this.priceSlider.value;
    this.priceMin.value = value;
    this.validatePriceInputs();
  }

  validatePriceInputs() {
    let min = parseInt(this.priceMin.value);
    let max = parseInt(this.priceMax.value);

    // Ensure min doesn't exceed max
    if (min > max) {
      min = max;
      this.priceMin.value = min;
    }

    // Update slider
    this.priceSlider.value = min;
  }

  handleSort() {
    const value = this.sortSelect.value;
    const url = new URL(window.location.href);
    url.searchParams.set('sort_by', value);
    this.refreshPage(url);
  }

  clearFilters() {
    // Clear checkboxes
    this.checkboxes.forEach(checkbox => checkbox.checked = false);

    // Reset price range
    this.priceMin.value = this.priceMin.min;
    this.priceMax.value = this.priceMax.max;
    this.priceSlider.value = this.priceMin.min;

    // Reset sort
    this.sortSelect.value = 'manual';

    // Clear URL parameters and refresh
    const url = new URL(window.location.href);
    url.search = '';
    this.refreshPage(url);
  }

  applyFilters() {
    const url = new URL(window.location.href);
    url.searchParams.delete('filter');

    // Add selected filters
    this.checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        url.searchParams.append('filter', checkbox.value);
      }
    });

    // Add price range
    url.searchParams.set('min_price', this.priceMin.value);
    url.searchParams.set('max_price', this.priceMax.value);

    // Add sort
    if (this.sortSelect.value !== 'manual') {
      url.searchParams.set('sort_by', this.sortSelect.value);
    }

    this.refreshPage(url);
  }

  async refreshPage(url) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'text/html',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Update product grid
      const productGrid = document.querySelector('[data-product-grid]');
      const newProductGrid = doc.querySelector('[data-product-grid]');
      if (productGrid && newProductGrid) {
        productGrid.innerHTML = newProductGrid.innerHTML;
      }

      // Update URL without page reload
      window.history.pushState({}, '', url);

      // Reinitialize product cards
      document.querySelectorAll('[data-product-card]').forEach(card => {
        new ProductCard(card);
      });
    } catch (error) {
      console.error('Error refreshing products:', error);
    }
  }
}

// Initialize filters
document.addEventListener('DOMContentLoaded', () => {
  new ProductFilters();
});