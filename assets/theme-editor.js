document.addEventListener('shopify:block:select', function(event) {
  const block = event.target;
  
  // Handle announcement bar selection
  if (block.matches('[data-announcement-bar]')) {
    block.classList.add('is-selected');
  }
  
  // Handle stats block selection
  if (block.matches('.stats__item')) {
    block.classList.add('is-selected');
  }
});

document.addEventListener('shopify:block:deselect', function(event) {
  const block = event.target;
  
  // Handle announcement bar deselection
  if (block.matches('[data-announcement-bar]')) {
    block.classList.remove('is-selected');
  }
  
  // Handle stats block deselection
  if (block.matches('.stats__item')) {
    block.classList.remove('is-selected');
  }
});

document.addEventListener('shopify:section:select', function(event) {
  const section = event.target;
  
  // Handle hero section selection
  if (section.matches('[data-hero]')) {
    section.classList.add('is-selected');
  }
  
  // Handle product grid section selection
  if (section.matches('[data-product-grid]')) {
    section.classList.add('is-selected');
  }
});

document.addEventListener('shopify:section:deselect', function(event) {
  const section = event.target;
  
  // Handle hero section deselection
  if (section.matches('[data-hero]')) {
    section.classList.remove('is-selected');
  }
  
  // Handle product grid section deselection
  if (section.matches('[data-product-grid]')) {
    section.classList.remove('is-selected');
  }
});

// Handle theme editor settings changes
document.addEventListener('shopify:theme:change', function(event) {
  const { key, value } = event.detail;
  
  switch (key) {
    case 'product_grid_layout':
      updateProductGridLayout(value);
      break;
    case 'show_secondary_image':
      toggleSecondaryImages(value);
      break;
    case 'sticky_header':
      toggleStickyHeader(value);
      break;
    case 'cart_notes_enable':
      toggleCartNotes(value);
      break;
  }
});

function updateProductGridLayout(columns) {
  const grid = document.querySelector('[data-product-grid]');
  if (!grid) return;
  
  grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

function toggleSecondaryImages(show) {
  const hoverImages = document.querySelectorAll('.product-card__hover-image');
  hoverImages.forEach(img => {
    img.style.display = show ? 'block' : 'none';
  });
}

function toggleStickyHeader(enabled) {
  const header = document.querySelector('.header');
  if (!header) return;
  
  if (enabled) {
    header.classList.add('header--sticky');
  } else {
    header.classList.remove('header--sticky');
  }
}

function toggleCartNotes(enabled) {
  const cartNotes = document.querySelector('.cart-drawer__notes');
  if (!cartNotes) return;
  
  cartNotes.style.display = enabled ? 'block' : 'none';
}