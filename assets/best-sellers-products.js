/**
 * best-sellers-products.js
 * Best Sellers product card showcase initialization
 */

class BestSellersProducts {
  constructor(sectionElement) {
    this.section = sectionElement;
    this.init();
  }

  init() {
    if (!this.section) return;
    // Section initialization & Theme Editor integration
  }
}

// Global Init Helper
function initBestSellersSections() {
  document.querySelectorAll('[data-section-type="best-sellers-products"]').forEach((section) => {
    if (!section.dataset.initialized) {
      new BestSellersProducts(section);
      section.dataset.initialized = 'true';
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBestSellersSections);
} else {
  initBestSellersSections();
}

// Shopify Theme Editor Listener
document.addEventListener('shopify:section:load', (event) => {
  const section = event.target.querySelector('[data-section-type="best-sellers-products"]');
  if (section) {
    new BestSellersProducts(section);
  }
});
