import React, { useState } from 'react';
import DifficultySelector from './components/DifficultySelector';
import Board from './components/Board';
import Header from './components/Header'
export default function App() {
  const [difficulty, setDifficulty] = useState(null);
  const [gameID, setGameID] = useState(null); // Store game ID

  const startGame = async (selectedDifficulty) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/start-game?difficulty=${selectedDifficulty}`
      );
      const data = await response.json();

      setGameID(data.gameID); // Store gameID from API response
      setDifficulty(selectedDifficulty);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="main-content" style={{ marginTop: "100px" }}>
        {!difficulty ? (
          <DifficultySelector setDifficulty={startGame} /> // Use startGame instead
        ) : (
          <Board difficulty={difficulty} gameID={gameID} /> // Pass gameID to Board
        )}
      </div>
    </div>
  );
}
