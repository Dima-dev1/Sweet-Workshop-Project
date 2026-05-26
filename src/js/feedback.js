import axios from 'axios';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { getFeedbacks } from './services/api/getFeedbacks.js';

const cardList = document.querySelector('.card-list');

async function fetchFeedbacks() {
  try {
    cardList.innerHTML = '<li class="loading">Завантаження відгуків...</li>';
    const data = await getFeedbacks({
      page: 1,
      limit: 10,
    });
    const feedbacks = data.feedbacks;

    renderFeedbacks(feedbacks);
    initFeedbackSlider();
  } catch (error) {
    cardList.innerHTML =
      '<li class="error">Не вдалося завантажити відгуки.</li>';
  }
}

function renderFeedbacks(feedbacks) {
  const markup = feedbacks
    .map(item => {
      const rate = item.rate;
      let roundedRate = Math.floor(rate);
      const delta = rate - roundedRate;

      if (delta > 0 && delta <= 0.5) {
        roundedRate += 0.5;
      } else if (delta > 0.5) {
        roundedRate += 1.0;
      }
      let stars = '';
      const svgStar = `
          <svg class="star-icon" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="star-half-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="50%" stop-color="#080C0C" />
        <stop offset="50%" stop-color="#E0E0E0" />
      </linearGradient>
    </defs>
    <path d="M9.07088 0.612343C9.41462 -0.204115 10.5854 -0.204114 10.9291 0.612346L12.9579 5.43123C13.1029 5.77543 13.4306 6.01061 13.8067 6.0404L19.0727 6.45748C19.9649 6.52814 20.3267 7.62813 19.6469 8.2034L15.6348 11.5987C15.3482 11.8412 15.223 12.2218 15.3106 12.5843L16.5363 17.661C16.744 18.5211 15.7969 19.201 15.033 18.7401L10.5245 16.0196C10.2025 15.8252 9.7975 15.8252 9.47548 16.0196L4.96699 18.7401C4.20311 19.201 3.25596 18.5211 3.46363 17.661L4.68942 12.5843C4.77698 12.2218 4.65182 11.8412 4.36526 11.5987L0.353062 8.2034C-0.326718 7.62813 0.0350679 6.52814 0.927291 6.45748L6.19336 6.0404C6.5695 6.01061 6.89716 5.77543 7.04207 5.43123L9.07088 0.612343Z" />
  </svg>
      `;

      for (let i = 1; i <= 5; i++) {
        if (roundedRate >= i) {
          stars += `<span class="feedback-star full">${svgStar}</span>`;
        } else if (roundedRate > i - 1 && roundedRate < i) {
          stars += `<span class="feedback-star half">${svgStar}</span>`;
        } else {
          stars += `<span class="feedback-star empty">${svgStar}</span>`;
        }
      }

      return `
       <li class="card-item swiper-slide">
        <div class="rating-box">
          <div class="stars-container">${stars}</div>
        </div>
        <p class="review-text">"${item.description}"</p>
        <h4 class="review-author">${item.author}</h4>
      </li>
    `;
    })
    .join('');

  cardList.innerHTML = markup;
}

function initFeedbackSlider() {
  new Swiper('.card-wrapper', {
    modules: [Navigation, Pagination],
    slidesPerView: 3,
    spaceBetween: 24,
    loop: false,
    watchSlidesProgress: true,
    navigation: {
      nextEl: '.next-btn',
      prevEl: '.prev-btn',
    },
    pagination: {
      el: '.slider-container-box .slider-list',
      clickable: true,
      bulletClass: 'slider-bullet',
      bulletActiveClass: 'active',
      renderBullet: function (index, className) {
        return `<li class="${className}"></li>`;
      },
    },
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 24 },
      768: { slidesPerView: 3, spaceBetween: 26 },
      1280: { slidesPerView: 3, spaceBetween: 24 },
    },
  });
}
fetchFeedbacks();
