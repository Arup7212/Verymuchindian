/* ══════════════════════════════════════════════════════════════
   In The Press Section JS
   ══════════════════════════════════════════════════════════════ */

if (!customElements.get('in-the-press')) {
  class InThePress extends HTMLElement {
    constructor() {
      super();
      this.track = this.querySelector('.itp__ticker-track');
      this.speed = parseInt(this.dataset.speed || 20, 10);
    }

    connectedCallback() {
      if (!this.track) return;
      this.initTicker();
      this.setAttribute('loaded', 'true');
    }

    initTicker() {
      // 1. Clone the original items to create a seamless loop
      const originalItems = Array.from(this.track.children);
      
      // We clone the entire set to ensure it's wide enough to scroll continuously
      // If there are very few logos, we might need to clone them multiple times
      // For safety, let's clone them at least twice, or until we exceed viewport width heavily
      let clonesNeeded = 2; // Default
      
      for (let i = 0; i < clonesNeeded; i++) {
        originalItems.forEach(item => {
          const clone = item.cloneNode(true);
          // Remove shopify block attributes from clones to prevent theme editor confusion
          clone.removeAttribute('data-shopify-editor-block');
          clone.removeAttribute('{{ block.shopify_attributes }}'); 
          this.track.appendChild(clone);
        });
      }

      // 2. Set animation
      // The animation duration is based on the speed setting and the track's content width
      // We use a fixed CSS keyframe `itp-marquee` that translates from 0 to -50% (or -33% depending on clone count).
      // Actually, standard approach: translate from 0 to - (width of original set).
      
      // Since we appended the original set `clonesNeeded` times, the total width is (clonesNeeded + 1) * originalWidth
      // We want to translate exactly 1 originalWidth to make it seamless.
      const cloneRatio = 1 / (clonesNeeded + 1);
      
      // Override the keyframes for this specific track dynamically
      this.track.style.animation = `itp-marquee ${this.speed}s linear infinite`;
      
      // Update keyframes logic via a dynamic stylesheet to support exact percentages
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes itp-marquee-dynamic-${this.id || Math.random().toString(36).substr(2, 9)} {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${cloneRatio * 100}%); }
        }
      `;
      document.head.appendChild(style);
      
      // Apply the dynamic animation
      const animationName = style.innerHTML.match(/@keyframes ([\w-]+)/)[1];
      this.track.style.animation = `${animationName} ${this.speed}s linear infinite`;
    }
  }

  customElements.define('in-the-press', InThePress);
}
