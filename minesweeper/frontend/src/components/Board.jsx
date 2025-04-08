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
  flags,
  setFlags,
  clickedMine,
  setClickedMine,
  onReturnToMenu,
  onRestartGame,
  hasWon,
  setHasWon
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
            setGameOver(true);

            if(data.clickedMine){
            setClickedMine([x, y]);
            }
            else if (data.gameWon){
              alert("YOU WIN!");
              setHasWon(true);
            }
           }
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  const handleFlagToggle = (x,y) => {
    if (gameOver) return;
    const newFlags = flags.map((row, rowIndex) =>
      row.map((flag, colIndex) => {
        if (rowIndex === x && colIndex === y) {
          return !flag;
        }
        return flag;
      })
    );
    setFlags(newFlags);
  }

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
                //right click for flags
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (!gameOver && !revealed[rowIndex][colIndex]) {
                    handleFlagToggle(rowIndex, colIndex);
                  }
                }}
                disabled={gameOver && !revealed[rowIndex][colIndex]}
              >
                {revealed[rowIndex][colIndex]
                  ? renderCellContent(cell, rowIndex, colIndex)
                  : !gameOver && flags[rowIndex][colIndex] && "🚩"}
              </button>
            ))
          )}
        </div>
      </div>
      {gameOver && (
        <GameOverBanner
          onReturnToMenu={onReturnToMenu}
          onRestartGame={onRestartGame}
          hasWon={hasWon}
        />
      )}
    </div>
  );
}
