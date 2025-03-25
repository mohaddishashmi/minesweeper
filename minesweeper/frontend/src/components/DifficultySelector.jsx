import React from 'react';

export default function DifficultySelector({ setDifficulty }) {
    return (
      <div className="difficulty-selector">
        <h2>Select Difficulty</h2>
        <div className="button-container">
          <div className="difficulty-option">
            <button onClick={() => setDifficulty("easy")}>Easy</button>
            <p className="difficulty-description">8x8 Grid, 10 Mines</p>
          </div>
          <div className="difficulty-option">
            <button onClick={() => setDifficulty("medium")}>Medium</button>
            <p className="difficulty-description">12x12 Grid, 24 Mines</p>
          </div>
          <div className="difficulty-option">
            <button onClick={() => setDifficulty("hard")}>Hard</button>
            <p className="difficulty-description">16x16 Grid, 40 Mines</p>
          </div>
        </div>
      </div>
    );
}
