/* ══════════════════════════════════════════════════════════════
   Celeb's Choice Section JS
   ══════════════════════════════════════════════════════════════ */

if (!customElements.get('celebs-choice')) {
  class CelebsChoice extends HTMLElement {
    constructor() {
      super();
      // The CSS scroll-snap handles the mobile swipe interaction natively and perfectly.
      // We can use this class to add any intersection observer logic for lazy loading
      // animations or tracking swipe events if needed in the future.
      
      this.grid = this.querySelector('.celebs-choice__grid');
    }

    connectedCallback() {
      // Mark as initialized
      this.setAttribute('loaded', 'true');
    }
  }

  customElements.define('celebs-choice', CelebsChoice);
}
