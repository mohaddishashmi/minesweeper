import React, { useState } from "react";
import DifficultySelector from "./components/DifficultySelector";
import Board from "./components/Board";
import Header from "./components/Header";

export default function App() {
  const [difficulty, setDifficulty] = useState(null);
  const [gameID, setGameID] = useState(null);
  const [board, setBoard] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [clickedMine, setClickedMine] = useState(null);


  const startGame = async (selectedDifficulty) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/start-game?difficulty=${selectedDifficulty}`
      );
      const data = await response.json();

      setGameID(data.gameID);
      setDifficulty(selectedDifficulty);
      setBoard(data.board); // stores actual board values like numbers and "M"
      setRevealed(data.revealed); // stores visibility of each tile
      setGameOver(false);
      setClickedMine(null);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  const handleRestartGame = () => {
    startGame(difficulty);
  }
  const handleReturnToMenu = () => {
    setDifficulty(null);
    setGameOver(false);
    setGameID(null);
    setBoard([]);
    setRevealed([]);
    setClickedMine(null);
  }
  return (
    <div>
      <Header />
      <div className="main-content" style={{ marginTop: "100px" }}>
        {!difficulty ? (
          <DifficultySelector setDifficulty={startGame} />
        ) : (
 
          //pass down board with all props
          <Board
            difficulty={difficulty}
            gameID={gameID}
            board={board}
            revealed={revealed}
            setRevealed={setRevealed}
            gameOver={gameOver}
            setGameOver={setGameOver}
            clickedMine={clickedMine}
            setClickedMine={setClickedMine}
            onReturnToMenu={handleReturnToMenu}
            onRestartGame={handleRestartGame}
          />
          
        )}
      </div>
    </div>
  );
}
