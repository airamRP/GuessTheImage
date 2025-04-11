// src/components/GameControls.jsx
import './GameControls.css';
import { gameConfig } from '../config/gameConfig';

const { THEMES, THEME_LABELS } = gameConfig;

function GameControls({ onReset, onRemoveLast, onThemeChange, gameStatus, currentGuesses, currentTheme }) {
  const themes = Object.values(THEMES);

  return (
    <div className="game-controls">
      {gameStatus === 'won' && <p>¡Ganaste!</p>}
      {gameStatus === 'lost' && <p className="lose">Perdiste. ¡Intenta de nuevo!</p>}

      {gameStatus === 'playing' && currentGuesses.length > 0 && (
        <button className='undo' onClick={onRemoveLast}>Deshacer</button>
      )}
      <button onClick={onReset}>Reiniciar</button>
      <select
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value)}
      >
        {themes.map((theme) => (
          <option key={theme} value={theme}>
            {THEME_LABELS[theme]}
          </option>
        ))}
      </select>
      
    </div>
  );
}

export default GameControls;