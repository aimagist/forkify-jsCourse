import View from './View.js';
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `
  No bookmarks currently. <br>
  Find a nice recipe and save it!`;
  _message = '';

  addHandlerRender(handlerFunction) {
    window.addEventListener('load', handlerFunction);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
