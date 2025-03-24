import React from 'react';

export default function DifficultySelector({ setDifficulty }) {
    return (
        <div className="difficulty-selector">
            <h2>Select Difficulty</h2>
            <button onClick={() => setDifficulty("easy")}>Easy</button>
            <button onClick={() => setDifficulty("medium")}>Medium</button>
            <button onClick={() => setDifficulty("hard")}>Hard</button>
        </div>
    );
}
