// src/Game.jsx
import ItemCard from './components/ItemCard';
import OptionSelector from './components/OptionSelector';
import GameControls from './components/GameControls';
import { useGameLogic } from './hooks/useGameLogic';

function Game() {
  // Usamos el Custom Hook para obtener toda la lógica
  const {
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
  } = useGameLogic();

  // Si está cargando, mostramos un mensaje
  if (isLoading) return <p>Cargando...</p>;

  // UI: solo renderizamos los componentes con las props necesarias
  return (
    <div className="game">
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
        onReset={handleReset}
        onRemoveLast={handleRemoveLast}
        onThemeChange={handleThemeChange}
        gameStatus={gameStatus}
        currentGuesses={currentAttempt ? currentAttempt.guesses : []}
        currentTheme={theme}
      />
    </div>
  );
}

export default Game;