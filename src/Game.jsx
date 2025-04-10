// src/Game.jsx
import { useState, useEffect } from 'react';
import ItemCard from './components/ItemCard';
import OptionSelector from './components/OptionSelector';
import GameControls from './components/GameControls';
import { fetchUniqueItems, fetchLimitedOptions } from './api/dogApi';
import { gameConfig } from './config/gameConfig';

const { MAX_ATTEMPTS, NUM_ITEMS_TO_GUESS } = gameConfig;

function Game() {
  const [items, setItems] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [limitedOptions, setLimitedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadGameData = async () => {
    setIsLoading(true);
    const uniqueItems = await fetchUniqueItems();
    setItems(uniqueItems);
    const options = await fetchLimitedOptions(uniqueItems);
    setLimitedOptions(options);
    setAttempts([]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadGameData();
  }, []);

  const handleSelect = (option) => {
    if (gameStatus !== 'playing' || attempts.length > MAX_ATTEMPTS) return;
    let currentAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null;
    if (!currentAttempt || currentAttempt.feedback.length > 0) {
      currentAttempt = { guesses: [], feedback: [] };
      setAttempts([...attempts, currentAttempt]);
    }
    if (currentAttempt.guesses.length < NUM_ITEMS_TO_GUESS) {
      const newGuesses = [...currentAttempt.guesses, option];
      setAttempts([...attempts.slice(0, -1), { ...currentAttempt, guesses: newGuesses }]);
    }
  };

  const handleCheck = () => {
    const currentAttempt = attempts[attempts.length - 1];
    const correct = items.map((item) => item.answer);
    if (JSON.stringify(correct) === JSON.stringify(currentAttempt.guesses)) {
      setAttempts([...attempts.slice(0, -1), { ...currentAttempt, feedback: Array(NUM_ITEMS_TO_GUESS).fill('correct') }]);
      setGameStatus('won');
      return;
    }
    const newFeedback = currentAttempt.guesses.map((guess, i) =>
      guess === correct[i] ? 'correct' : correct.includes(guess) ? 'misplaced' : 'wrong'
    );
    const updatedAttempts = [...attempts.slice(0, -1), { ...currentAttempt, feedback: newFeedback }];
    if (updatedAttempts.length < MAX_ATTEMPTS) {
      setAttempts(updatedAttempts);
      setGameStatus('checked');
    } else {
      setAttempts([...updatedAttempts, { guesses: correct, feedback: Array(NUM_ITEMS_TO_GUESS).fill('correct') }]);
      setGameStatus('lost');
    }
  };

  const handleRetry = () => {
    if (attempts.length < MAX_ATTEMPTS && gameStatus === 'checked') {
      setAttempts([...attempts, { guesses: [], feedback: [] }]);
      setGameStatus('playing');
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    setAttempts([]);
    setGameStatus('playing');
    await loadGameData();
  };

  if (isLoading) return <p>Cargando...</p>;

  const currentAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null;
  const attemptsLeft = MAX_ATTEMPTS - attempts.length;

  return (
    <div className="game">
      {/* <h1>Adivina la Raza</h1> */}
      <div className="image-grid">
        {items.map((item, index) => (
          <ItemCard
            key={item.imageUrl}
            imageUrl={item.imageUrl}
            attempts={attempts}
            index={index}
            gameStatus={gameStatus}
          />
        ))}
      </div>
      <OptionSelector
        options={limitedOptions}
        onSelect={handleSelect}
        disabled={gameStatus !== 'playing' || (currentAttempt && currentAttempt.feedback.length > 0)}
      />
      <GameControls
        onCheck={handleCheck}
        onReset={handleReset}
        onRetry={handleRetry}
        canCheck={currentAttempt && currentAttempt.guesses.length === NUM_ITEMS_TO_GUESS}
        canRetry={attempts.length > 0 && attempts.length < MAX_ATTEMPTS}
        gameStatus={gameStatus}
        attemptsLeft={attemptsLeft}
      />
    </div>
  );
}

export default Game;