import { openDessertModal } from './dessertDetails.js';
import { getCategories } from './services/api/getCategories';
import { getAllDesserts } from './services/api/getAllDesserts';

let currentPage = 1;
let currentCategory = null;
const perPage = 8;

const getList = document.querySelector('#dessert-id');
const getLoadMoreBtn = document.querySelector('.load-more-btn');

async function loadCategories() {
  try {
    const categoriesData = await getCategories();
    const selectContainer = document.querySelector('.categories-select');
    const desktopContainer = document.querySelector(
      '.container-categories-btn'
    );

    if (selectContainer) {
      const optionsMarkup = categoriesData
        .map(cat => {
          return `<option value="${cat._id}">${cat.name}</option>`;
        })
        .join('');
      selectContainer.innerHTML =
        '<option value="">Всі десерти</option>' + optionsMarkup;
    }

    if (desktopContainer) {
      const buttonsMarkup = categoriesData
        .map(cat => {
          return `<li><button class="category-btn" data-id="${cat._id}">${cat.name}</button></li>`;
        })
        .join('');
      desktopContainer.innerHTML =
        '<li><button class="category-btn active" data-id="">Всі десерти</button></li>' +
        buttonsMarkup;
    }
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити десерти. Спробуйте пізніше.',
      position: 'topRight',
      transitionIn: 'fadeInLeft',
    });
  }
}

async function loadDesserts(categoryId = null, isLoadMore = false) {
  const loader = document.querySelector('.loader');
  if (loader) loader.classList.remove('is-hidden');

  try {
    if (!isLoadMore) {
      currentPage = 1;
      currentCategory = categoryId;
    }

    const params = {
      page: currentPage,
      limit: perPage,
    };
    if (categoryId && categoryId.trim() !== '') {
      params.category = categoryId;
    }
    const dessertsData = await getAllDesserts(params);
    if (!getList) return;

    const markupDesert = dessertsData.desserts
      .map(({ _id, image, name, category, description, price }) => {
        return `
          <li class="dessert-card">
            <div class="dessert-img-thumb">
                <img src="${image}" alt="${name}" class="dessert-img" loading="lazy"/>
            </div>
            
            <div class="dessert-card-content">
                <p class="dessert-category-card">${category.name}</p>
                <h3 class="dessert-title-card">${name}</h3>
                <p class="description-dessert">${description}</p>
                
                <div class="dessert-card-footer">
                    <p class="dessert-price">Ціна: <span>${price} грн</span></p>
                    
                    <button type="button" class="open-modal-btn" data-id="${_id}">
                     <svg class="modal-btn-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="7" y1="17" x2="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
                    </button>
                </div>
            </div>
        </li>
            `;
      })
      .join('');

    if (isLoadMore) {
      getList.insertAdjacentHTML('beforeend', markupDesert);
    } else {
      getList.innerHTML = markupDesert;
    }

    const totalLoader = currentPage * perPage;
    if (getLoadMoreBtn) {
      if (totalLoader >= dessertsData.totalItems) {
        getLoadMoreBtn.style.display = 'none';
      } else {
        getLoadMoreBtn.style.display = 'block';
      }
    }
  } catch (error) {
    if (typeof iziToast !== 'undefined') {
      iziToast.error({
        title: 'Помилка',
        message: 'Не вдалося завантажити десерти. Спробуйте пізніше.',
        position: 'topRight',
        transitionIn: 'fadeInLeft',
      });
    }
  } finally {
    if (loader) loader.classList.add('is-hidden');
  }
}
const mobileSelect = document.querySelector('.categories-select');
if (mobileSelect) {
  mobileSelect.addEventListener('change', async event => {
    const selectedCategoryId = event.target.value;
    await loadDesserts(selectedCategoryId);
  });
}
const desktopBtn = document.querySelector('.container-categories-btn');
if (desktopBtn) {
  desktopBtn.addEventListener('click', async event => {
    const clickedBtn = event.target.closest('button');
    if (!clickedBtn) return;

    const currentActive = desktopBtn.querySelector('.category-btn.active');
    if (currentActive) currentActive.classList.remove('active');
    clickedBtn.classList.add('active');

    await loadDesserts(clickedBtn.dataset.id);
  });
}

if (getLoadMoreBtn) {
  getLoadMoreBtn.addEventListener('click', async () => {
    currentPage += 1;
    await loadDesserts(currentCategory, true);
  });
}

loadCategories();
loadDesserts();

document.addEventListener('click', e => {
  const btn = e.target.closest('.open-modal-btn');
  if (!btn) return;
  openDessertModal(btn.dataset.id);
});
