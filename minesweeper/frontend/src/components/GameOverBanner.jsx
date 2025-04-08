import React from 'react';

export default function GameOverBanner({ onReturnToMenu, onRestartGame, hasWon }) {
  return (
    <div className="game-over-banner">
      <h2>{hasWon ? "🎉 You Win!" : "💥 You Lose"}</h2>
      <div>
        <button onClick={onReturnToMenu}>Main Menu</button>
        <button onClick={onRestartGame}>Restart</button>
      </div>
    </div>
  );
}
