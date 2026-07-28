/**
 * tradition-collections.js
 * Interactive logic for the Tradition Collections showcase section
 */

class TraditionCollections {
  constructor(sectionElement) {
    this.section = sectionElement;
    this.init();
  }

  init() {
    if (!this.section) return;

    this.initScrollAnimations();
    this.initCardInteractions();
  }

  initScrollAnimations() {
    const animatableElements = this.section.querySelectorAll('.tc-card, .tc-trust-item, .tc-brand-banner');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('tc-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      animatableElements.forEach((el, index) => {
        el.classList.add('tc-fade-in');
        el.style.transitionDelay = `${(index % 3) * 0.1}s`;
        observer.observe(el);
      });
    } else {
      animatableElements.forEach((el) => el.classList.add('tc-visible'));
    }
  }

  initCardInteractions() {
    const cards = this.section.querySelectorAll('.tc-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
}

// Global initialization helper
function initTraditionCollectionsSections() {
  document.querySelectorAll('[data-section-type="tradition-collections"]').forEach((section) => {
    if (!section.dataset.initialized) {
      new TraditionCollections(section);
      section.dataset.initialized = 'true';
    }
  });
}

// Auto-run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTraditionCollectionsSections);
} else {
  initTraditionCollectionsSections();
}

// Shopify Theme Editor Integration
document.addEventListener('shopify:section:load', (event) => {
  const section = event.target.querySelector('[data-section-type="tradition-collections"]');
  if (section) {
    new TraditionCollections(section);
  }
});
