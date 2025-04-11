// src/hooks/useGameLogic.js
import { useState, useEffect, useCallback } from 'react';
import { fetchUniqueItems, fetchLimitedOptions } from '../api/dogApi';
import { gameConfig } from '../config/gameConfig';

const { MAX_ATTEMPTS, NUM_ITEMS_TO_GUESS } = gameConfig;

export function useGameLogic(initialTheme = 'dogs') {
  const [items, setItems] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [limitedOptions, setLimitedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(initialTheme);

  const loadGameData = async () => {
    setIsLoading(true);
    const uniqueItems = await fetchUniqueItems(theme);
    setItems(uniqueItems);
    const options = await fetchLimitedOptions(uniqueItems, theme);
    setLimitedOptions(options);
    setAttempts([]);
    setGameStatus('playing');
    setIsLoading(false);
  };

  useEffect(() => {
    loadGameData();
  }, [theme]);

  // Función 1: Validar si se puede seleccionar
  const canSelect = () => gameStatus === 'playing' && attempts.length <= MAX_ATTEMPTS;

  // Función 2: Obtener o crear el intento actual
  const getOrCreateAttempt = () => {
    const lastAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null;
    if (!lastAttempt || lastAttempt.feedback.length > 0) {
      const newAttempt = { guesses: [], feedback: [] };
      setAttempts([...attempts, newAttempt]);
      return newAttempt;
    }
    return lastAttempt;
  };

  // Función 3: Añadir una opción al intento
  const addGuessToAttempt = (attempt, option) => {
    const newGuesses = [...attempt.guesses, option];
    return { ...attempt, guesses: newGuesses };
  };

  // Función 4: Evaluar un intento completo
  const evaluateAttempt = (guesses) => {
    const correct = items.map((item) => item.answer);
    const isCorrect = JSON.stringify(correct) === JSON.stringify(guesses);
    const feedback = guesses.map((guess, i) =>
      guess === correct[i] ? 'correct' : correct.includes(guess) ? 'misplaced' : 'wrong'
    );
    return { isCorrect, feedback, correct };
  };

  // Función 5: Actualizar el estado tras evaluación
  const updateGameState = (attempt, evaluation) => {
    const updatedAttempts = [...attempts.slice(0, -1), { ...attempt, feedback: evaluation.feedback }];
    
    if (evaluation.isCorrect) {
      setAttempts(updatedAttempts);
      setGameStatus('won');
    } else if (updatedAttempts.length < MAX_ATTEMPTS) {
      setAttempts([...updatedAttempts, { guesses: [], feedback: [] }]);
      setGameStatus('playing');
    } else {
      setAttempts([...updatedAttempts, { guesses: evaluation.correct, feedback: Array(NUM_ITEMS_TO_GUESS).fill('correct') }]);
      setGameStatus('lost');
    }
  };

  // handleSelect simplificado
  // useCallback: memoización - onSelect - OptionSelector.jsx
  const handleSelect = useCallback((option) => {
    if (!canSelect()) return;

    const currentAttempt = getOrCreateAttempt();
    const updatedAttempt = addGuessToAttempt(currentAttempt, option);

    if (updatedAttempt.guesses.length === NUM_ITEMS_TO_GUESS) {
      const evaluation = evaluateAttempt(updatedAttempt.guesses);
      updateGameState(updatedAttempt, evaluation);
    } else {
      setAttempts((prev) => [...prev.slice(0, -1), updatedAttempt]);
    }
  }, [attempts, gameStatus, items]); // Dependencias de handleSelect

  const handleRemoveLast = () => {
    if (gameStatus !== 'playing' || attempts.length === 0) return;

    const currentAttempt = attempts[attempts.length - 1];
    if (!currentAttempt || currentAttempt.feedback.length > 0 || currentAttempt.guesses.length === 0) return;

    const newGuesses = currentAttempt.guesses.slice(0, -1);
    setAttempts([...attempts.slice(0, -1), { ...currentAttempt, guesses: newGuesses }]);
  };

  const handleReset = async () => {
    setIsLoading(true);
    setAttempts([]);
    setGameStatus('playing');
    await loadGameData();
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const currentAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null;

  return {
    items,
    attempts,
    gameStatus,
    limitedOptions,
    isLoading,
    theme,
    currentAttempt,
    handleSelect,
    handleRemoveLast,
    handleReset,
    handleThemeChange,
  };
}