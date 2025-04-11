// src/config/gameConfig.js
export const gameConfig = {
  MAX_ATTEMPTS: 5,          // Número máximo de intentos
  NUM_ITEMS_TO_GUESS: 5,    // Número de ítems a adivinar (perros, banderas, etc.)
  NUM_OPTIONS: 10,          // Número total de opciones para elegir
  // API_BASE_URL: 'https://dog.ceo/api', // Base para la API, cambiable en el futuro
  THEMES: {
    DOGS: 'dogs',
    FLAGS: 'flags',
  },
  THEME_LABELS: {
    dogs: 'Perros',
    flags: 'Banderas',
  },
};