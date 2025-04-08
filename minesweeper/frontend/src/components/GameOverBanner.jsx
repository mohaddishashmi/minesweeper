import React from 'react';

export default function GameOverBanner({ onReturnToMenu, onRestartGame }) {
  return (
    <div className="game-over-banner">
      <h2>💥 Game Over 💥</h2>
      <div>
        <button onClick = {onReturnToMenu}>Main Menu</button>
        <button onClick={onRestartGame}>Restart</button>
      </div>
    </div>
  );
}
