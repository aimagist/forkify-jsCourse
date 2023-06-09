import View from './View.js';

import icons from 'url:../../img/icons.svg';
import fracty from 'fracty';

class recipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = `We couldn't find this recipe. Please try another one.`;
  _message;

  addHandlerUpdateServings(handlerFunction) {
    this._parentElement.addEventListener('click', function (e) {
      const clickedBtn = e.target.closest('.btn--update-servings');
      if (!clickedBtn) return;
      console.log(clickedBtn);
      const updateTo = +clickedBtn.dataset.updateTo;
      if (updateTo) handlerFunction(updateTo);
    });
  }

  addHandlerRender(handlerFunction) {
    // convertimos a recipeView en publisher, sostiene los sensores de eventos y se encarga de publicar
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handlerFunction)
    );
  }

  addHandlerBookmark(handlerFunction) {
    this._parentElement.addEventListener('click', function (e) {
      const button = e.target.closest('.btn--bookmark');
      // console.log(button);
      if (!button) return;
      button.classList.add();
      handlerFunction();
    });
  }

  _generateMarkup() {
    return `
    <figure class="recipe__fig">
    <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
    <h1 class="recipe__title">
      <span>${this._data.title}</span>
    </h1>
    </figure>
    
    <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${
        this._data.cookingTime
      }</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${
        this._data.servings
      }</span>
    
      <span class="recipe__info-text">servings</span>

    <div class="recipe__info-buttons">
      <button class="btn--tiny btn--update-servings" data-update-to="${
        this._data.servings - 1
      }">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
      </button>
      <button class="btn--tiny btn--update-servings" data-update-to="${
        this._data.servings + 1
      }">
          <svg>
        <use href="${icons}#icon-plus-circle"></use>
            </svg>
      </button>
        </div>
      </div>
    
          <div class="recipe__user-generated">
          </div>
          <button class="btn--round btn--bookmark ">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    } "></use>
            </svg>
          </button>
        </div>
    
        <div class="recipe__ingredients">
          <h2 class="heading--2">recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this._data.ingredients
              .map(ingredient => {
                return this._generateMarkupIngredient(ingredient);
              })
              .join('')}
          </ul>
        </div>
    
        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;
  }

  _generateMarkupIngredient(ingredient) {
    return `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${
                ingredient.quantity
                  ? fracty(ingredient.quantity).toString()
                  : ''
              }</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ingredient.unit}</span>
                ${ingredient.description}
              </div>
           </li>
            `;
  }
}
export default new recipeView();