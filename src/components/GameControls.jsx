// src/components/GameControls.jsx
function GameControls({ onCheck, onReset, onRetry, canCheck, canRetry, gameStatus, attemptsLeft }) {
  return (
    <div className="game-controls">
      <button onClick={onCheck} disabled={!canCheck || gameStatus !== 'playing'}>Comprobar</button>
      {canRetry && (
        <button onClick={onRetry} disabled={gameStatus !== 'checked' || attemptsLeft === 0}>Intentar de nuevo</button>
      )}
      <button onClick={onReset}>Jugar de nuevo</button>
      {gameStatus === 'won' && <p className="message win">¡Has ganado!</p>}
      {gameStatus === 'checked' && attemptsLeft > 0 && (
        <p className="message">Te quedan {attemptsLeft} intento{attemptsLeft > 1 ? 's' : ''}</p>
      )}
      {gameStatus === 'lost' && <p className="message lose">Has perdido</p>}
    </div>
  );
}

export default GameControls;