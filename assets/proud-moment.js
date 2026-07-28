/**
 * proud-moment.js
 * Handles scroll reveal animations and Shopify section editor events.
 */

class ProudMomentSection {
  constructor(sectionEl) {
    this.section = sectionEl;
    this.init();
  }

  init() {
    this.bindRevealAnimations();
  }

  bindRevealAnimations() {
    const animateEls = this.section.querySelectorAll(
      '.pm-image-wrap, .pm-heading-pre, .pm-heading-main, .pm-heading-line2, .pm-divider, .pm-description, .pm-endorsement-card, .pm-stats-card, .pm-cta-button'
    );

    if (!window.IntersectionObserver) return;

    animateEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = `opacity 0.6s ease ${i * 0.07}s, transform 0.6s cubic-bezier(0.25, 1, 0.5, 1) ${i * 0.07}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    animateEls.forEach((el) => observer.observe(el));
  }
}

function initProudMomentSections() {
  document.querySelectorAll('[data-section-type="proud-moment"]').forEach((section) => {
    if (!section.dataset.initialized) {
      new ProudMomentSection(section);
      section.dataset.initialized = 'true';
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProudMomentSections);
} else {
  initProudMomentSections();
}

document.addEventListener('shopify:section:load', (event) => {
  const section = event.target.querySelector('[data-section-type="proud-moment"]');
  if (section) {
    section.removeAttribute('data-initialized');
    new ProudMomentSection(section);
    section.dataset.initialized = 'true';
  }
});
