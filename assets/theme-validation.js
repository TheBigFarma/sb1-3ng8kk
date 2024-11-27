class ThemeValidator {
  constructor() {
    this.validationResults = {
      productCard: {},
      cartDrawer: {},
      filters: {},
      quickView: {},
      packBuilder: {},
      hero: {},
      stats: {}
    };
    
    this.runValidations();
  }

  async runValidations() {
    await this.validateProductCard();
    await this.validateCartDrawer();
    await this.validateFilters();
    await this.validateQuickView();
    await this.validatePackBuilder();
    await this.validateHero();
    await this.validateStats();
    
    this.logResults();
  }

  async validateProductCard() {
    const card = document.querySelector('[data-product-card]');
    if (!card) return;

    this.validationResults.productCard = {
      exists: true,
      addToCartButton: !!card.querySelector('[data-add-to-cart]'),
      quickViewButton: !!card.querySelector('[data-quick-view-trigger]'),
      variantSelector: !!card.querySelector('[data-variant-select]'),
      hoverImage: !!card.querySelector('.product-card__hover-image')
    };
  }

  async validateCartDrawer() {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;

    this.validationResults.cartDrawer = {
      exists: true,
      closeButton: !!drawer.querySelector('[data-cart-drawer-close]'),
      quantityControls: !!drawer.querySelector('[data-quantity-input]'),
      removeButton: !!drawer.querySelector('[data-item-remove]'),
      checkoutButton: !!drawer.querySelector('.cart-drawer__checkout')
    };
  }

  async validateFilters() {
    const filters = document.querySelector('[data-product-filters]');
    if (!filters) return;

    this.validationResults.filters = {
      exists: true,
      priceSlider: !!filters.querySelector('[data-price-slider]'),
      checkboxes: !!filters.querySelector('[data-filter-checkbox]'),
      sortSelect: !!filters.querySelector('[data-sort-select]'),
      clearButton: !!filters.querySelector('[data-clear-filters]')
    };
  }

  async validateQuickView() {
    const quickView = document.querySelector('[data-quick-view-modal]');
    if (!quickView) return;

    this.validationResults.quickView = {
      exists: true,
      closeButton: !!quickView.querySelector('[data-quick-view-close]'),
      gallery: !!quickView.querySelector('[data-main-image]'),
      form: !!quickView.querySelector('[data-product-form]')
    };
  }

  async validatePackBuilder() {
    const packBuilder = document.querySelector('[data-pack-builder]');
    if (!packBuilder) return;

    this.validationResults.packBuilder = {
      exists: true,
      quantityControls: !!packBuilder.querySelector('[data-quantity-input]'),
      variantSelect: !!packBuilder.querySelector('[data-variant-select]'),
      addToCartButton: !!packBuilder.querySelector('[data-add-pack-to-cart]'),
      summary: !!packBuilder.querySelector('[data-selected-items]')
    };
  }

  async validateHero() {
    const hero = document.querySelector('[data-hero]');
    if (!hero) return;

    this.validationResults.hero = {
      exists: true,
      backgroundImage: !!hero.querySelector('.hero__background-image'),
      promoCode: !!hero.querySelector('.hero__promo-code'),
      ctaButton: !!hero.querySelector('.hero__cta'),
      floatingElements: !!hero.querySelector('.hero__floating-elements')
    };
  }

  async validateStats() {
    const stats = document.querySelector('.stats');
    if (!stats) return;

    this.validationResults.stats = {
      exists: true,
      items: stats.querySelectorAll('.stats__item').length === 3,
      icons: !!stats.querySelector('.stats__icon svg'),
      numbers: !!stats.querySelector('.stats__number')
    };
  }

  logResults() {
    console.group('Theme Validation Results');
    Object.entries(this.validationResults).forEach(([section, results]) => {
      console.group(section);
      Object.entries(results).forEach(([test, passed]) => {
        console.log(`${test}: ${passed ? '✅' : '❌'}`);
      });
      console.groupEnd();
    });
    console.groupEnd();
  }
}

// Run validation on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  new ThemeValidator();
});