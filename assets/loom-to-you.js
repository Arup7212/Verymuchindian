/* ══════════════════════════════════════════════════════════════
   From The Loom To You Section JS
   ══════════════════════════════════════════════════════════════ */

if (!customElements.get('loom-to-you')) {
  class LoomToYou extends HTMLElement {
    constructor() {
      super();
      this.videos = this.querySelectorAll('video');
    }

    connectedCallback() {
      this.initVideoObserver();
      this.setAttribute('loaded', 'true');
    }

    // Optional: Play videos only when they are in the viewport to save resources
    initVideoObserver() {
      if (this.videos.length === 0 || !('IntersectionObserver' in window)) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(e => console.warn('Autoplay prevented', e));
          } else {
            video.pause();
          }
        });
      }, { rootMargin: '50px' });

      this.videos.forEach(video => {
        // Ensure videos are muted for autoplay policies
        video.muted = true;
        observer.observe(video);
      });
    }
  }

  customElements.define('loom-to-you', LoomToYou);
}
