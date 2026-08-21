class CollectionSlider {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector('.cs-slider-track');
    this.prevBtn = container.querySelector('.cs-arrow.prev');
    this.nextBtn = container.querySelector('.cs-arrow.next');
    this.slides = container.querySelectorAll('.cs-slide');
    
    if (!this.track || this.slides.length === 0) return;

    this.autoplayEnabled = container.dataset.autoplay === 'true';
    this.autoplaySpeed = parseInt(container.dataset.speed) || 3000;
    this.intervalId = null;

    this.init();
  }

  init() {
    this.bindEvents();
    if (this.autoplayEnabled) {
      this.startAutoplay();
    }
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.scroll('left');
        this.resetAutoplay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.scroll('right');
        this.resetAutoplay();
      });
    }

    // Pause autoplay on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => {
      if (this.autoplayEnabled) this.startAutoplay();
    });
  }

  getScrollAmount() {
    // Scroll by one slide width + gap
    return this.slides[0].offsetWidth + 20; 
  }

  scroll(direction) {
    const scrollAmount = this.getScrollAmount();
    
    if (direction === 'left') {
      this.track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      // Check if we reached the end
      const maxScroll = this.track.scrollWidth - this.track.clientWidth;
      if (this.track.scrollLeft >= maxScroll - 10) {
        // Loop back to start
        this.track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        this.track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }

  startAutoplay() {
    this.stopAutoplay();
    this.intervalId = setInterval(() => {
      this.scroll('right');
    }, this.autoplaySpeed);
  }

  stopAutoplay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resetAutoplay() {
    if (this.autoplayEnabled) {
      this.startAutoplay();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.cs-slider-wrapper');
  sliders.forEach(slider => new CollectionSlider(slider));
});

// Support for Shopify theme editor
document.addEventListener('shopify:section:load', (event) => {
  const sliders = event.target.querySelectorAll('.cs-slider-wrapper');
  sliders.forEach(slider => new CollectionSlider(slider));
});
