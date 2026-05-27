import { getDessertById } from './services/api/getDessertById.js';

let currentDessertId = null;

export async function openDessertModal(id) {
  currentDessertId = id;

  try {
    const dessert = await getDessertById(id);
    fillModal(dessert);
    showModal();
  } catch {}
}

function fillModal(dessert) {
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
}

function showModal() {
  document.querySelector('.js-modal-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.querySelector('.js-modal-overlay').classList.add('hidden');
  document.body.style.overflow = '';
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  const star = type => `<div class="star ${type}"></div>`;
  const stars = [
    ...Array(full).fill(star('')),
    ...(half ? [star('half')] : []),
    ...Array(empty).fill(star('empty')),
  ].join('');

  return `<div class="rating"><div class="star-container">${stars}</div></div>`;
}

setTimeout(() => {
  const overlay = document.querySelector('.js-modal-overlay');
  const closeBtn = document.querySelector('.js-modal-close');
  const orderBtn = document.querySelector('.js-go-to-order');

  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', e => e.target === overlay && closeModal());
  orderBtn?.addEventListener('click', () => {
    closeModal();
    import('./order.js').then(({ openModal }) => openModal(currentDessertId));
  });
}, 0);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
