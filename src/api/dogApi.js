// src/api/dogApi.js
import { gameConfig } from '../config/gameConfig';
import { shuffle } from '../utils/shuffle';

/* // Tema configurable (puedes cambiarlo aquí o pasarlo dinámicamente)
const THEME = 'dogs'; // Cambia a 'flags' para probar banderas
const DATA_URL = `https://airamRP.github.io/GuessTheImageData/${THEME}.json`; // Reemplaza my-user */

const { NUM_ITEMS_TO_GUESS, NUM_OPTIONS } = gameConfig;

export async function fetchUniqueItems(theme) {
  const DATA_URL = `https://airamRP.github.io/GuessTheImageData/${theme}.json`;
  const res = await fetch(DATA_URL);
  const allItems = await res.json();
  return shuffle(allItems).slice(0, NUM_ITEMS_TO_GUESS);
}

export async function fetchLimitedOptions(items, theme) {
  const DATA_URL = `https://airamRP.github.io/GuessTheImageData/${theme}.json`;
  const res = await fetch(DATA_URL);
  const allItems = await res.json();
  const correct = items.map((item) => item.answer);
  const restItems = allItems.filter(item => !correct.includes(item.answer));
  const randomItems = shuffle(restItems).slice(0, NUM_OPTIONS - NUM_ITEMS_TO_GUESS);
  return [...correct, ...randomItems.map(item => item.answer)].sort();
}
