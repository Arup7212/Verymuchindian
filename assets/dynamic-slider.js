document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll('.dynamic-slider-section');

  sections.forEach(section => {
    const wrapper = section.querySelector('.dynamic-slider-wrapper');
    const slides = section.querySelectorAll('.dynamic-slide');
    const prevBtn = section.querySelector('.prev-arrow');
    const nextBtn = section.querySelector('.next-arrow');
    const dotsContainer = section.querySelector('.slider-dots');
    
    if (!wrapper || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Create dots
    if (dotsContainer && totalSlides > 1) {
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    const dots = section.querySelectorAll('.slider-dot');

    function updateDots() {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function goToSlide(index) {
      if (index < 0) {
        currentIndex = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      
      wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }

    // Touch/Swipe support
    let startX = 0;
    let endX = 0;
    
    wrapper.addEventListener('touchstart', e => {
      startX = e.changedTouches[0].screenX;
    }, {passive: true});

    wrapper.addEventListener('touchend', e => {
      endX = e.changedTouches[0].screenX;
      handleSwipe();
    }, {passive: true});

    function handleSwipe() {
      if (startX - endX > 50) {
        goToSlide(currentIndex + 1); // Swipe left
      }
      if (endX - startX > 50) {
        goToSlide(currentIndex - 1); // Swipe right
      }
    }

    // Mute/Unmute video functionality
    const muteBtns = section.querySelectorAll('.mute-btn');
    muteBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const video = this.closest('.split-video-wrapper').querySelector('video');
        if (video) {
          video.muted = !video.muted;
          if (video.muted) {
             // Muted icon (speaker with x)
             this.innerHTML = '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
          } else {
             // Unmuted icon (speaker with waves)
             this.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
          }
        }
      });
    });

  });
});
