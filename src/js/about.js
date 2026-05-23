import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

let aboutSwiper = null;

const shouldInitSwiper = () => window.matchMedia('(min-width: 1200px)').matches;

const initAboutSwiper = () => {
  const slider = document.querySelector('.about__swiper');
  const prevButton = document.querySelector('.about__nav-button--prev');
  const nextButton = document.querySelector('.about__nav-button--next');

  if (!slider || !prevButton || !nextButton) {
    return;
  }

  if (!shouldInitSwiper()) {
    if (aboutSwiper) {
      aboutSwiper.destroy(true, true);
      aboutSwiper = null;
    }
    return;
  }

  if (aboutSwiper) {
    return;
  }

  aboutSwiper = new Swiper(slider, {
    slidesPerView: 2,
    spaceBetween: 24,
    grabCursor: true,
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
    pagination: {
      el: '.about__pagination',
      type: 'bullets',
      clickable: true,
      bulletClass: 'about__pagination-bullet',
      bulletActiveClass: 'about__pagination-bullet--active',
      renderBullet: (index, className) =>
        `<button type="button" class="${className}" aria-label="Перейти до слайду ${index + 1}"></button>`,
    },
    watchOverflow: true,
    on: {
      init() {
        slider.classList.add('about__swiper--initialized');
      },
    },
  });
  window.aboutSwiper = aboutSwiper;
};

const updateAboutSwiper = () => {
  if (shouldInitSwiper() && !aboutSwiper) {
    initAboutSwiper();
  }
  if (!shouldInitSwiper() && aboutSwiper) {
    aboutSwiper.destroy(true, true);
    aboutSwiper = null;
    window.aboutSwiper = null;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateAboutSwiper);
} else {
  updateAboutSwiper();
}

window.addEventListener('resize', updateAboutSwiper);
