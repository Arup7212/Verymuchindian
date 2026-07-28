/**
 * shop-by-price.js
 * Auto-slider for Shop By Price section
 */

class ShopByPriceSlider {
  constructor(sectionElement) {
    this.section = sectionElement;
    this.viewport = this.section.querySelector('.sbp-slider-viewport');
    this.track = this.section.querySelector('.sbp-slider-track');
    this.prevBtn = this.section.querySelector('.sbp-nav-button.prev');
    this.nextBtn = this.section.querySelector('.sbp-nav-button.next');

    this.autoplay = this.section.dataset.autoplay === 'true';
    const rawSpeed = parseInt(this.section.dataset.autoplaySpeed, 10) || 4;
    this.autoplaySpeed = rawSpeed < 100 ? rawSpeed * 1000 : rawSpeed;

    this.currentIndex = 0;
    this.autoplayTimer = null;
    this.isDragging = false;
    this.startX = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;

    this.init();
  }

  init() {
    if (!this.viewport || !this.track) return;
    this.updateMetrics();
    this.bindEvents();
    if (this.autoplay) this.startAutoplay();
  }

  updateMetrics() {
    this.items = Array.from(this.track.querySelectorAll('.sbp-card'));
    if (!this.items.length) return;
    const itemWidth = this.items[0].offsetWidth;
    const style = window.getComputedStyle(this.track);
    const gap = parseInt(style.gap || '18', 10);
    this.stepSize = itemWidth + gap;
    this.visibleWidth = this.viewport.offsetWidth;
    this.totalTrackWidth = this.items.length * this.stepSize - gap;
    this.maxScroll = Math.max(0, this.totalTrackWidth - this.visibleWidth);
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.stopAutoplay();
        this.prevSlide();
        if (this.autoplay) this.startAutoplay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.stopAutoplay();
        this.nextSlide();
        if (this.autoplay) this.startAutoplay();
      });
    }

    this.viewport.addEventListener('mousedown', this.dragStart.bind(this));
    this.viewport.addEventListener('mousemove', this.dragMove.bind(this));
    this.viewport.addEventListener('mouseup', this.dragEnd.bind(this));
    this.section.addEventListener('mouseleave', () => {
      if (this.isDragging) this.dragEnd();
      this.resumeAutoplay();
    });
    this.section.addEventListener('mouseenter', () => this.stopAutoplay());

    this.viewport.addEventListener('touchstart', this.dragStart.bind(this), { passive: true });
    this.viewport.addEventListener('touchmove', this.dragMove.bind(this), { passive: true });
    this.viewport.addEventListener('touchend', this.dragEnd.bind(this));

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.updateMetrics();
        this.slideToIndex(this.currentIndex);
      }, 150);
    });
  }

  dragStart(e) {
    this.isDragging = true;
    this.startX = this.getX(e);
    this.stopAutoplay();
    this.track.style.transition = 'none';
  }

  dragMove(e) {
    if (!this.isDragging) return;
    const diff = this.getX(e) - this.startX;
    let next = this.prevTranslate + diff;
    if (next > 0) next = next * 0.3;
    else if (Math.abs(next) > this.maxScroll) {
      next = -(this.maxScroll + (Math.abs(next) - this.maxScroll) * 0.3);
    }
    this.currentTranslate = next;
    this.track.style.transform = `translateX(${next}px)`;
  }

  dragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    const moved = this.currentTranslate - this.prevTranslate;
    if (moved < -40) this.nextSlide();
    else if (moved > 40) this.prevSlide();
    else this.slideToIndex(this.currentIndex);
    this.resumeAutoplay();
  }

  getX(e) {
    return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  }

  slideToIndex(index) {
    this.updateMetrics();
    const maxIndex = Math.max(0, Math.ceil(this.maxScroll / this.stepSize));
    if (index > maxIndex) this.currentIndex = 0;
    else if (index < 0) this.currentIndex = maxIndex;
    else this.currentIndex = index;

    const target = -Math.min(this.currentIndex * this.stepSize, this.maxScroll);
    this.track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.35, 1)';
    this.track.style.transform = `translateX(${target}px)`;
    this.prevTranslate = target;
    this.currentTranslate = target;
  }

  nextSlide() { this.slideToIndex(this.currentIndex + 1); }
  prevSlide() { this.slideToIndex(this.currentIndex - 1); }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => this.nextSlide(), this.autoplaySpeed);
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  resumeAutoplay() {
    if (this.autoplay && !this.autoplayTimer) this.startAutoplay();
  }
}

function initShopByPriceSections() {
  document.querySelectorAll('[data-section-type="shop-by-price"]').forEach((section) => {
    if (!section.dataset.initialized) {
      new ShopByPriceSlider(section);
      section.dataset.initialized = 'true';
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShopByPriceSections);
} else {
  initShopByPriceSections();
}

document.addEventListener('shopify:section:load', (event) => {
  const section = event.target.querySelector('[data-section-type="shop-by-price"]');
  if (section) new ShopByPriceSlider(section);
});
