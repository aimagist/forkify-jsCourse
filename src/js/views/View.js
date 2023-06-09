import icons from '../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render de received object to the DOM
   * @param {Object | Object[]} data The data to be rendered
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup is returned is render=false
   * @this {Object} View instance
   * @author Federico Michel
   * @todo finish implementation
   */
  render(data, render = true) {
    // console.log(data);

    if (!data || (Array.isArray(data) && data.length == 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length == 0))
    //   return this.renderError();
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));
    newElements.forEach((newEl, i) => {
      const curEl = currElements[i];
      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue?.trim() !== '' &&
        newEl !== undefined
      ) {
        // console.log(`🔥` + newEl?.firstChild?.nodeValue?.trim());
        curEl.textContent = newEl.textContent;
      }
      // Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attribute =>
          curEl.setAttribute(attribute.name, attribute.value)
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>  
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    // console.log(message);
    const markup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>  
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
