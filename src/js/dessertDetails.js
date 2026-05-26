import { getDessertById } from './services/api/getDessertById.js';

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

    document.querySelector('.js-modal-overlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } catch (error) {
    console.error(error);
  }
}

function closeModal() {
  const overlay = document.querySelector('.js-modal-overlay');
  if (overlay) overlay.classList.add('hidden');
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

setTimeout(() => {
  const closeBtn = document.querySelector('.js-modal-close');
  const overlay = document.querySelector('.js-modal-overlay');
  const goToOrderBtn = document.querySelector('.js-go-to-order');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });
  }

  if (goToOrderBtn) {
    goToOrderBtn.addEventListener('click', () => {
      closeModal();
      // dynamically import to avoid circular dependency
      import('./order.js').then(({ openModal }) => {
        openModal(currentDessertId);
      });
    });
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
