import React from "react";

export default function Board({
  difficulty,
  gameID,
  board,
  revealed,
  setRevealed,
}) {
  const handleTileClick = (x, y) => {
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

        if (data.gameOver) {
          alert("Game Over! You clicked on a mine.");
        }

        setRevealed(data.board); // update the entire revealed board
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  const renderCellContent = (cell) => {
    if (cell === "M") return "💣";
    if (cell === 0) return "";
    return String(cell);
  };


  return (
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
              }`}
              onClick={() => handleTileClick(rowIndex, colIndex)}
            >
              {revealed[rowIndex][colIndex] && renderCellContent(cell)}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
