document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll('.draped-grid');

  sliders.forEach(slider => {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      // Only apply drag to scroll on horizontal scrolling layouts (mobile)
      if (window.innerWidth > 767) return; 
      isDown = true;
      slider.style.cursor = 'grabbing';
      slider.style.scrollSnapType = 'none'; // Disable snap while dragging
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.style.cursor = '';
      slider.style.scrollSnapType = 'x mandatory';
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.style.cursor = '';
      slider.style.scrollSnapType = 'x mandatory';
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // scroll-fast multiplier
      slider.scrollLeft = scrollLeft - walk;
    });
  });
});
