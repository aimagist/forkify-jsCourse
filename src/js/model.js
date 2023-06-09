import { API_URL } from './config.js';
import { KEY } from './config.js';
// import { getJSON } from './helpers.js';
// import { sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

import { RESULTS_PER_PAGE } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  // console.log(data);
  const { recipe } = data.data;
  // console.log(recipe);

  return {
    id: recipe.id,
    ingredients: recipe.ingredients,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }), // conditonally adding properties
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    console.log(data);
    state.recipe = createRecipeObject(data);

    // Bookmark persistance
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // console.log(state.recipe);
  } catch (err) {
    console.error(`${err} 🔥🔥🔥🔥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
    // console.log(state.search.results);
    // console.log(state);
  } catch (err) {
    console.error(`${err} 🔥🔥🔥🔥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0;
  const end = page * state.search.resultsPerPage; // 9;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings = state.recipe.servings) {
  try {
    // console.log(state.recipe.ingredients);
    state.recipe.ingredients.forEach(ingredient => {
      ingredient.quantity =
        (ingredient.quantity * newServings) / state.recipe.servings;
    });
  } catch (err) {
    console.error(`${err} Model error updateServings🔥🔥🔥🔥`);
    throw err;
  }

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const removeBookmark = function (id) {
  // Remove bookmark
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  // Mark recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
  console.log(localStorage);
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
// console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  // console.log(newRecipe);
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        const ingArr = ingredient[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format. Please use the correct format.'
          );

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    // console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    // console.log(data);
    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
