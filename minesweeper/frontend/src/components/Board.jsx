import React from "react";
import GameOverBanner from "./GameOverBanner";

export default function Board({
  difficulty,
  gameID,
  board,
  revealed,
  setRevealed,
  gameOver,
  setGameOver,
  clickedMine,
  setClickedMine,
  onReturnToMenu,
  onRestartGame
}) {
  const handleTileClick = (x, y) => {
    if (gameOver) return;
    fetch("http://localhost:5000/api/tile-click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameID, x, y }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("Error:", data.error);
          return;
        }
        setRevealed(data.board); // update the entire revealed board
           if (data.gameOver) {
             setClickedMine([x, y]);
             setGameOver(true);
           }
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  const renderCellContent = (cell, x, y) => {

   if (cell === "M") {
     if (clickedMine && clickedMine[0] === x && clickedMine[1] === y) {
       return "❌"; // Clicked mine
     }
     return "💣"; // Other mines
   }
    if (cell === 0) return "";
    return String(cell);
  };


  return (
    <div>
      {gameOver && (<GameOverBanner 
      onReturnToMenu={onReturnToMenu}
      onRestartGame={onRestartGame}
      />)}
      <div className="game-container">
        <div
          className="game-board"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${board.length}, 30px)`,
            gap: "2px",
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`tile ${
                  revealed[rowIndex][colIndex] ? `revealed number-${cell}` : ""
                } ${
                  gameOver && !revealed[rowIndex][colIndex] ? "disabled" : ""
                }`}
                onClick={() => {
                  if (!gameOver && !revealed[rowIndex][colIndex]) {
                    handleTileClick(rowIndex, colIndex);
                  }
                }}
                disabled={gameOver && !revealed[rowIndex][colIndex]}
              >
                {revealed[rowIndex][colIndex] &&
                  renderCellContent(cell, rowIndex, colIndex)}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
