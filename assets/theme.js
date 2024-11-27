document.addEventListener('DOMContentLoaded', () => {
  // Header scroll behavior
  const header = document.querySelector('[data-header]');
  if (header) {
    let lastScroll = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > header.offsetHeight) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }
      lastScroll = currentScroll;
    });
  }
});