const parallaxSections = document.querySelectorAll('.hero, .about, .cta');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let frameRequested = false;

function updateParallax() {
  if (reduceMotion.matches) {
    parallaxSections.forEach((section) => {
      section.style.removeProperty('--parallax-offset');
    });
    frameRequested = false;
    return;
  }

  const viewportCenter = window.innerHeight / 2;

  parallaxSections.forEach((section) => {
    const bounds = section.getBoundingClientRect();

    if (bounds.bottom > 0 && bounds.top < window.innerHeight) {
      const sectionCenter = bounds.top + bounds.height / 2;
      const offset = (viewportCenter - sectionCenter) * 0.15;
      section.style.setProperty('--parallax-offset', `${offset}px`);
    }
  });

  frameRequested = false;
}

function requestParallaxUpdate() {
  if (!frameRequested) {
    frameRequested = true;
    window.requestAnimationFrame(updateParallax);
  }
}

window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
window.addEventListener('resize', requestParallaxUpdate);
reduceMotion.addEventListener('change', requestParallaxUpdate);
requestParallaxUpdate();