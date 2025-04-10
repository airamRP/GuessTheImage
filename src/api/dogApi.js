// src/api/dogApi.js
import { gameConfig } from '../config/gameConfig';
import { shuffle } from '../utils/shuffle';

const { NUM_ITEMS_TO_GUESS, NUM_OPTIONS } = gameConfig;
const DATA_URL = 'https://airamRP.github.io/dog-game-data/dogs.json'; // GitHub Pages


export async function fetchUniqueItems() {
  const res = await fetch(DATA_URL);
  const allItems = await res.json();
  return shuffle(allItems).slice(0, NUM_ITEMS_TO_GUESS);
}

export async function fetchLimitedOptions(items) {
  const res = await fetch(DATA_URL);
  const allItems = await res.json();
  const correct = items.map((item) => item.answer);
  const restItems = allItems.filter(item => !correct.includes(item.answer));
  const randomItems = shuffle(restItems).slice(0, NUM_OPTIONS - NUM_ITEMS_TO_GUESS);
  return [...correct, ...randomItems.map(item => item.answer)].sort();
}