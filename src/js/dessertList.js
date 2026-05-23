import { getDessertById } from './services/api/getDessertById.js';

const overlay = document.querySelector('.js-modal-overlay');

const closeBtn = document.querySelector('.js-modal-close');

export async function openDessertModal(id) {
  try {
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
    console.log(error);
  }
}

closeBtn.addEventListener('click', closeModal);

overlay.addEventListener('click', e => {
  if (e.target === overlay) {
    closeModal();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

function closeModal() {
  overlay.classList.add('hidden');

  document.body.style.overflow = '';
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);

  const hasHalf = rating % 1 >= 0.5;

  const totalStars = 5;

  let starsHTML = '';

  for (let i = 0; i < fullStars; i++) {
    starsHTML += `<div class="star"></div>`;
  }

  if (hasHalf) {
    starsHTML += `<div class="star half"></div>`;
  }

  const emptyStars = totalStars - fullStars - (hasHalf ? 1 : 0);

  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `<div class="star empty"></div>`;
  }

  return `
    <div class="rating">
      <div class="star-container">
        ${starsHTML}
      </div>
    </div>
  `;
}

// TEST
openDessertModal('6852a9fcb459460cb6b47723');
