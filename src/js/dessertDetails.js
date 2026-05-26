import { getDessertById } from './services/api/getDessertById.js';
import { openModal } from './order.js';

const overlay = document.querySelector('.js-modal-overlay');
const closeBtn = document.querySelector('.js-modal-close');
let currentDessertId = null;

export async function openDessertModal(id) {
  try {
    currentDessertId = id;
    const dessert = await getDessertById(id);

    document.querySelector('.js-modal-img').src = dessert.image;
    document.querySelector('.js-modal-img').alt = dessert.name;
    document.querySelector('.js-modal-title').textContent = dessert.name;
    document.querySelector('.js-modal-price').textContent =
      `${dessert.price} грн`;
    document.querySelector('.js-modal-desc').textContent = dessert.description;
    document.querySelector('.js-modal-composition').textContent =
      dessert.composition;
    document.querySelector('.js-modal-stars').innerHTML = renderStars(
      dessert.rate
    );

    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } catch (error) {
    console.error(error);
  }
}

document.querySelector('.js-go-to-order').addEventListener('click', () => {
  closeModal();
  openModal(currentDessertId);
});

closeBtn.addEventListener('click', closeModal);

overlay.addEventListener('click', e => {
  if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

function closeModal() {
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  let starsHTML = '';
  for (let i = 0; i < fullStars; i++) starsHTML += `<div class="star"></div>`;
  if (hasHalf) starsHTML += `<div class="star half"></div>`;
  for (let i = 0; i < emptyStars; i++)
    starsHTML += `<div class="star empty"></div>`;

  return `<div class="rating"><div class="star-container">${starsHTML}</div></div>`;
}
